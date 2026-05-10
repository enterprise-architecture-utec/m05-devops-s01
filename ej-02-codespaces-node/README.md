# 🌐 EJ-02 — GitHub Codespaces + Node.js + Secrets y Environments

**Tiempo estimado:** 25 minutos  
**Nivel:** Intermedio  
**Herramientas:** GitHub Codespaces, Node.js, Jest, GitHub Actions Secrets, Environments

---

## 🎯 Objetivo

Experimentar **GitHub Codespaces** como entorno de desarrollo reproducible en la nube — sin instalar nada localmente. Luego construir un workflow que usa **Secrets** para configuración sensible y **Environments** para controlar el despliegue a staging.

```
Codespace (en el navegador)
    │
    ├── devcontainer.json define:
    │     ├── Node.js 20
    │     ├── extensiones VS Code
    │     └── comandos post-create
    │
    └── El mismo entorno en Actions runner:
          ├── Job: test        → Jest + coverage
          ├── Job: build       → genera artifact (dist/)
          └── Job: notify      → usa SECRET + VARS para simular notificación
                                  environment: staging (con gate)
```

---

## 📁 Archivos del ejercicio

| Archivo | Descripción |
|---------|-------------|
| `.devcontainer/devcontainer.json` | Configuración del Codespace |
| `.github/workflows/ci-node.yml` | Workflow CI + notify con secrets |
| `src/api.js` | Módulo Node.js a probar |
| `tests/api.test.js` | Tests con Jest |
| `package.json` | Dependencias del proyecto |

---

## 🚀 Pasos del Ejercicio

### Paso 1 — Crear el repositorio

Crea un repositorio público en GitHub llamado `m05-codespaces-node`. Copia los archivos de este ejercicio.

### Paso 2 — Abrir el Codespace

1. Ve a tu repositorio en GitHub
2. Clic en el botón verde **Code** → pestaña **Codespaces**
3. Clic en **Create codespace on main**

> ⏱️ El Codespace tarda ~1-2 minutos en arrancar la primera vez. Mientras espera, continúa leyendo.

**¿Qué es un Codespace?**
Es un entorno de desarrollo completo que corre en la nube de GitHub, basado en el archivo `.devcontainer/devcontainer.json`. Incluye VS Code en el navegador, terminal, extensiones y el runtime configurado.

El archivo `devcontainer.json` de este ejercicio define:
```json
{
  "image": "mcr.microsoft.com/devcontainers/javascript-node:20",
  "postCreateCommand": "npm install",
  "extensions": ["dbaeumer.vscode-eslint", "esbenp.prettier-vscode"]
}
```

Esto garantiza que **todos los alumnos tienen exactamente el mismo entorno**, sin importar qué sistema operativo usan localmente.

### Paso 3 — Explorar el entorno desde el Codespace

Una vez que el Codespace esté listo, abre la terminal integrada (`` Ctrl+` ``) y ejecuta:

```bash
# Verificar Node.js instalado por el devcontainer
node --version    # debe mostrar v20.x.x
npm --version

# Ejecutar los tests localmente
npm test

# Ver la cobertura
npm run test:coverage
```

Verás los tests de Jest pasar en la terminal del Codespace — el mismo resultado que en el runner de GitHub Actions.

### Paso 4 — Analizar el módulo `src/api.js`

Abre `src/api.js`. Es un módulo Express-like que simula endpoints de una API REST:

```javascript
function crearRespuesta(statusCode, datos) { ... }
function validarEmail(email) { ... }
function calcularDescuento(precio, porcentaje) { ... }
```

Son funciones puras — fáciles de testear sin levantar un servidor real.

### Paso 5 — Configurar Secrets y Variables en GitHub

El workflow usa un secret `SLACK_WEBHOOK_URL` para simular una notificación. Configúralo:

1. Ve a tu repositorio → **Settings** → **Secrets and variables** → **Actions**
2. Clic en **New repository secret**
3. Nombre: `SLACK_WEBHOOK_URL`
4. Valor: `https://hooks.slack.com/services/SIMULADO/PARA/LAB` *(cualquier URL para el lab)*
5. Clic en **Add secret**

Luego agrega una **variable** (no secret — valor no cifrado):

1. Pestaña **Variables** → **New repository variable**
2. Nombre: `APP_ENV`
3. Valor: `staging`

> 💡 **Diferencia clave:**
> - `secrets.*` → valores cifrados, nunca aparecen en logs, para contraseñas/tokens
> - `vars.*` → valores en texto plano, para configuración no sensible

### Paso 6 — Crear el Environment "staging"

Los Environments permiten agregar aprobadores manuales antes de que un job se ejecute.

1. Ve a **Settings** → **Environments** → **New environment**
2. Nombre: `staging`
3. En **Deployment protection rules** → activa **Required reviewers**
4. Agrégarte a ti mismo como reviewer
5. Guarda

### Paso 7 — Hacer push y observar el workflow

Desde el Codespace, edita `src/api.js` para agregar una función nueva:

```javascript
// Agregar al final de src/api.js
function formatearMoneda(valor, moneda = 'PEN') {
    return `${moneda} ${valor.toFixed(2)}`;
}

module.exports = { crearRespuesta, validarEmail, calcularDescuento, formatearMoneda };
```

Y agrega el test en `tests/api.test.js`:

```javascript
describe('formatearMoneda', () => {
    test('formatea con PEN por defecto', () => {
        expect(formatearMoneda(99.5)).toBe('PEN 99.50');
    });

    test('formatea con USD', () => {
        expect(formatearMoneda(10, 'USD')).toBe('USD 10.00');
    });
});
```

Haz commit y push desde el Codespace:

```bash
git add .
git commit -m "feat: agregar formatearMoneda con tests"
git push origin main
```

### Paso 8 — Observar el pipeline en Actions

Ve a la pestaña **Actions**. Verás el workflow con 3 jobs:

```
test   → build   → notify
  ✅         ✅       ⏳ Esperando aprobación...
```

El job `notify` tiene `environment: staging` — GitHub pausará la ejecución y te enviará una notificación para aprobar el despliegue.

1. Haz clic en el workflow run
2. Clic en **Review pending deployments**
3. Selecciona `staging` y clic en **Approve and deploy**
4. Observa cómo el job `notify` se ejecuta con el `SLACK_WEBHOOK_URL` inyectado

### Paso 9 — Examinar cómo se usan los secrets en el workflow

Abre `.github/workflows/ci-node.yml` y busca el job `notify`:

```yaml
notify:
  needs: build
  runs-on: ubuntu-latest
  environment: staging          # ← gate de aprobación

  steps:
    - name: Simular notificación
      run: |
        echo "Notificando deployment a ${{ vars.APP_ENV }}"
        echo "Webhook configurado: ${{ secrets.SLACK_WEBHOOK_URL != '' && 'SÍ' || 'NO' }}"
        # En producción real: curl -X POST ${{ secrets.SLACK_WEBHOOK_URL }} ...
      env:
        WEBHOOK: ${{ secrets.SLACK_WEBHOOK_URL }}
```

> ⚠️ **Nunca hagas `echo ${{ secrets.SLACK_WEBHOOK_URL }}`** — GitHub enmascara los secrets en logs, pero es mala práctica. Siempre pasa los secrets como variables de entorno al step.

---

## 🔍 Conceptos practicados

| Concepto | Descripción |
|----------|-------------|
| **devcontainer.json** | Define el entorno reproducible del Codespace |
| **GitHub Codespaces** | IDE en la nube — mismo entorno que el runner |
| **`secrets.*`** | Valores cifrados para contraseñas y tokens |
| **`vars.*`** | Variables de configuración no sensibles |
| **Environments** | Gates de aprobación antes de desplegar |
| **`needs:`** | Cadena de dependencias entre jobs |
| **`if: always()`** | Ejecutar un step aunque los anteriores fallen |

---

## 📚 Referencias

- [GitHub Codespaces](https://docs.github.com/en/codespaces)
- [devcontainer.json reference](https://containers.dev/implementors/json_reference/)
- [Encrypted secrets](https://docs.github.com/en/actions/security-for-github-actions/security-guides/using-secrets-in-github-actions)
- [Environments](https://docs.github.com/en/actions/managing-workflow-runs-and-deployments/managing-deployments/managing-environments-for-deployment)

---

## ➡️ Siguiente ejercicio

[`../ej-03-custom-action/README.md`](../ej-03-custom-action/README.md)
