# 🔧 EJ-02 — Custom Composite Action: `notify-and-tag`

**Tiempo estimado:** 25 minutos  
**Nivel:** Avanzado  
**Herramientas:** GitHub Actions Custom Actions (Composite), Reusable Workflow pattern

---

## 🎯 Objetivo

Crear una **Custom Composite Action** reutilizable que encapsula tres pasos repetitivos en cualquier pipeline de release:

1. Crear un **git tag** semántico
2. Generar **release notes** automáticas
3. Enviar una **notificación** (simulada)

Una vez publicada en `.github/actions/`, cualquier workflow del mismo repositorio (o de la organización) puede invocarla con una sola línea — sin repetir código.

```
Antes (sin Custom Action):           Después (con Custom Action):
─────────────────────────────────    ─────────────────────────────────
jobs:                                jobs:
  release:                             release:
    steps:                               steps:
      - name: Crear tag                    - name: Checkout
        run: git tag v1.0.0                  uses: actions/checkout@v4
      - name: Generar notas              
        run: |                             - name: Notify and Tag
          echo "## v1.0.0" > notes.md        uses: ./.github/actions/notify-and-tag
          git log --oneline...               with:
      - name: Notificar                      version: "1.0.0"
        run: curl -X POST ...                environment: production
      # ↑ 30 líneas repetidas               webhook_url: ${{ secrets.WEBHOOK }}
      #   en cada workflow
                                       # ↑ 5 líneas — la Action encapsula todo
```

---

## 📁 Archivos del ejercicio

| Archivo | Descripción |
|---------|-------------|
| `.github/actions/notify-and-tag/action.yml` | **La Custom Composite Action** |
| `.github/actions/notify-and-tag/README.md` | Documentación de la Action |
| `.github/workflows/release.yml` | Workflow que consume la Action |
| `src/app.py` | Aplicación de ejemplo (el código que se "lanza") |

---

## 🏗️ Anatomía de una Composite Action

Una Custom Action vive en un directorio con un `action.yml`. Tiene tres secciones:

```yaml
# action.yml

name: "Notify and Tag"          # ← Nombre en la UI de GitHub

inputs:                          # ← Lo que el caller le pasa
  version:
    description: "..."
    required: true
  environment:
    description: "..."
    default: "staging"

outputs:                         # ← Lo que la Action devuelve al caller
  tag_name:
    description: "..."
    value: ${{ steps.create_tag.outputs.tag }}

runs:
  using: composite               # ← Tipo: composite (no docker, no javascript)
  steps:                         # ← Los pasos que encapsula
    - name: Crear tag
      shell: bash
      run: ...
```

> 💡 **`using: composite`** es el tipo más fácil de crear — combina steps de shell igual que en un workflow normal, pero empaquetados y reutilizables.

---

## 🚀 Pasos del Ejercicio

### Paso 1 — Crear el repositorio

Crea un repositorio público en GitHub llamado `m05-custom-action`. Copia los archivos de este ejercicio.

### Paso 2 — Leer la estructura de la Action

Abre `.github/actions/notify-and-tag/action.yml`. Esta Action recibe:

| Input | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| `version` | string | ✅ | Versión semántica (ej: `1.2.3`) |
| `environment` | string | ❌ | Entorno destino (default: `staging`) |
| `webhook_url` | string | ❌ | URL del webhook para notificación |
| `create_tag` | boolean | ❌ | Si debe crear el git tag (default: `true`) |

Y produce estos outputs:

| Output | Descripción |
|--------|-------------|
| `tag_name` | El tag git creado (ej: `v1.2.3`) |
| `release_notes` | Ruta al archivo de release notes generado |

### Paso 3 — Analizar el workflow que la consume

Abre `.github/workflows/release.yml`. Observa cómo se invoca la Action:

```yaml
- name: Ejecutar notify-and-tag
  uses: ./.github/actions/notify-and-tag    # ← path local al action.yml
  with:
    version: ${{ github.event.inputs.version }}
    environment: production
    webhook_url: ${{ secrets.SLACK_WEBHOOK_URL }}
    create_tag: true
```

El `uses: ./` con path relativo le dice a GitHub que la Action está en el **mismo repositorio**, en esa ruta.

### Paso 4 — Configurar el Secret

1. Ve a **Settings** → **Secrets and variables** → **Actions**
2. Crea el secret `SLACK_WEBHOOK_URL` con cualquier URL (simulado)

### Paso 5 — Disparar el workflow manualmente

El workflow `release.yml` usa `workflow_dispatch` con un input `version`:

1. Ve a la pestaña **Actions** de tu repositorio
2. Selecciona el workflow **Release — notify-and-tag**
3. Clic en **Run workflow**
4. Ingresa la versión: `1.0.0`
5. Selecciona el entorno: `production`
6. Clic en **Run workflow**

Observa los logs — verás cada step de la Action ejecutándose con sus nombres y outputs.

### Paso 6 — Examinar los outputs de la Action

En el log del workflow, verás algo como:

```
▶ Ejecutar notify-and-tag
  ▶ Validar inputs
    ✅ Versión: 1.0.0 (formato válido)
    ✅ Entorno: production
  ▶ Crear git tag
    ✅ Tag v1.0.0 creado
  ▶ Generar release notes
    📝 release-notes-v1.0.0.md generado
  ▶ Simular notificación
    📢 Notificación enviada a production
```

### Paso 7 — Consumir los outputs en el workflow caller

El workflow `release.yml` captura los outputs de la Action y los usa:

```yaml
- name: Ejecutar Action
  id: release_action         # ← id para referenciar outputs
  uses: ./.github/actions/notify-and-tag
  with:
    version: "1.0.0"

- name: Mostrar resultados
  run: |
    echo "Tag creado: ${{ steps.release_action.outputs.tag_name }}"
    echo "Notas en: ${{ steps.release_action.outputs.release_notes }}"
```

### Paso 8 — Modificar la Action (experimentar)

Abre `.github/actions/notify-and-tag/action.yml` y agrega un nuevo step al final de `runs.steps`:

```yaml
- name: Crear resumen en GitHub
  shell: bash
  run: |
    echo "## 🚀 Release ${{ inputs.version }}" >> $GITHUB_STEP_SUMMARY
    echo "| Campo | Valor |" >> $GITHUB_STEP_SUMMARY
    echo "|-------|-------|" >> $GITHUB_STEP_SUMMARY
    echo "| Versión | \`v${{ inputs.version }}\` |" >> $GITHUB_STEP_SUMMARY
    echo "| Entorno | ${{ inputs.environment }} |" >> $GITHUB_STEP_SUMMARY
    echo "| Commit | \`${{ github.sha }}\` |" >> $GITHUB_STEP_SUMMARY
```

`$GITHUB_STEP_SUMMARY` es una variable especial de GitHub Actions que escribe en el resumen visual del workflow run. Haz commit y vuelve a disparar el workflow — verás el resumen en la UI.

### Paso 9 — Verificar reutilización entre workflows

Observa que el repositorio tiene **un solo** `action.yml` pero **dos workflows** (`release.yml` y un segundo `hotfix.yml`) que la consumen. Este es el principio DRY (Don't Repeat Yourself) aplicado a CI/CD.

Si necesitas cambiar cómo funciona la notificación, solo editas `action.yml` — los dos workflows se actualizan automáticamente en el próximo run.

---

## 🔍 Conceptos practicados

| Concepto | Descripción |
|----------|-------------|
| **Composite Action** | `using: composite` — combina steps shell en una Action |
| **`inputs` y `outputs`** | Interfaz de la Action: qué recibe y qué devuelve |
| **`uses: ./path`** | Invocar una Action local del mismo repositorio |
| **`id:` en steps** | Capturar outputs de un step para usarlos después |
| **`$GITHUB_OUTPUT`** | Forma moderna de pasar outputs entre steps |
| **`$GITHUB_STEP_SUMMARY`** | Escribir resúmenes visuales en la UI del workflow |
| **`workflow_dispatch` + inputs** | Disparar workflows manualmente con parámetros |
| **DRY en CI/CD** | Una Action, múltiples workflows — cambio en un lugar |

---

## 💡 ¿Cuándo usar cada tipo de Action?

| Tipo | Cuándo usarlo |
|------|---------------|
| **Composite** | Orquestar pasos shell existentes — el más simple de crear |
| **JavaScript** | Lógica compleja, acceso a API de GitHub, sin contenedor |
| **Docker** | Herramientas específicas, entorno aislado, solo Linux |

Para el 80% de los casos en una organización, una **Composite Action** es suficiente.

---

## 📚 Referencias

- [Creating a composite action](https://docs.github.com/en/actions/sharing-automations/creating-actions/creating-a-composite-action)
- [Metadata syntax for GitHub Actions](https://docs.github.com/en/actions/sharing-automations/creating-actions/metadata-syntax-for-github-actions)
- [workflow_dispatch inputs](https://docs.github.com/en/actions/writing-workflows/choosing-when-your-workflow-runs/events-that-trigger-workflows#workflow_dispatch)
