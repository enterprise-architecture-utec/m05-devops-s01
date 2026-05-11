# ⚡ EJ-01 — Pipeline CI con Python + GitHub Flow

**Tiempo estimado:** 25 minutos  
**Nivel:** Básico-Intermedio  
**Herramientas:** GitHub Actions, Python, pytest, flake8

---

## 🎯 Objetivo

Construir un pipeline CI profesional que se dispara automáticamente en cada `push` y `pull_request`. Practicarás el **GitHub Flow** completo: crear una rama, hacer cambios, abrir un PR y ver cómo el workflow valida el código antes de mergear.

```
Developer
    │
    ├── git checkout -b feature/suma
    │        │
    │        ├── editar código
    │        ├── git push origin feature/suma
    │        │
    │        └──► GitHub Actions se dispara automáticamente
    │                  ├── Job: lint  (flake8 revisa estilo)
    │                  └── Job: test  (pytest en Python 3.10, 3.11, 3.12)
    │                           └── Matrix: 3 runners en paralelo
    │
    └── Abrir Pull Request → CI debe pasar → Merge a main
```

---

## 📁 Archivos del ejercicio

| Archivo | Descripción |
|---------|-------------|
| `.github/workflows/ci.yml` | Workflow CI principal |
| `src/calculadora.py` | Módulo Python a probar |
| `tests/test_calculadora.py` | Tests con pytest |
| `requirements.txt` | Dependencias (pytest, flake8, coverage) |

---

## 🚀 Pasos del Ejercicio

### Paso 1 — Crear el repositorio en GitHub

Ve a https://github.com/new y crea un repositorio **público** llamado `m05-ci-python`. Inicialízalo con un README.

### Paso 2 — Agregar el código fuente

Copia los archivos de este ejercicio a tu repositorio:

```
m05-ci-python/
├── .github/
│   └── workflows/
│       └── ci.yml
├── src/
│   └── calculadora.py
│   └── __init__.py
├── tests/
│   └── test_calculadora.py
│   └── __init__.py
└── requirements.txt
```

Observa `src/calculadora.py` — es una calculadora simple con operaciones básicas:

```python
def sumar(a, b):
    return a + b

def dividir(a, b):
    if b == 0:
        raise ValueError("No se puede dividir entre cero")
    return a / b
```

### Paso 3 — Analizar el workflow CI

Abre `.github/workflows/ci.yml` y analiza su estructura:

```yaml
on:
  push:
    branches: [main, 'feature/**']   # ← Se dispara en push a estas ramas
  pull_request:
    branches: [main]                  # ← Y en PRs hacia main
```

**Jobs en el workflow:**

```
ci.yml
├── Job: lint
│     runs-on: ubuntu-latest
│     steps: flake8 revisa estilo PEP8
│
└── Job: test
      strategy:
        matrix:
          python-version: [3.10, 3.11, 3.12]   ← 3 runners en paralelo
      steps:
        - pytest con coverage
        - upload del reporte de cobertura
```

> 💡 **Matrix Strategy:** GitHub lanza 3 jobs en paralelo, uno por versión de Python. Si tu código funciona en 3.10 pero falla en 3.12, el matrix te lo detecta.

### Paso 4 — Guarda todos los cambios en tu repositorio

Ve a la pestaña **Actions** de tu repositorio en GitHub. Verás el workflow ejecutándose. Espera a que termine — debería mostrar ✅ en ambos jobs.

Examina los detalles:
- Haz clic en el workflow run
- Observa los 3 jobs del matrix corriendo en paralelo
- Haz clic en un job → expande cada step para ver los logs

### Paso 5 — Practicar GitHub Flow: crear una rama de feature

```bash
# Crear rama de feature (GitHub Flow)
git checkout -b feature/potencia

# Editar src/calculadora.py y agregar la función potencia
```

Agrega esta función al final de `src/calculadora.py`:

```python
def potencia(base, exponente):
    return base ** exponente
```

Y agrega el test en `tests/test_calculadora.py`:

```python
def test_potencia_positiva(self):
    assert potencia(2, 3) == 8

def test_potencia_cero(self):
    assert potencia(5, 0) == 1
```

```bash
git add .
git commit -m "feat: agregar función potencia"
git push origin feature/potencia
```

Ve a Actions — el CI se dispara automáticamente en tu rama `feature/potencia`.

### Paso 6 — Abrir un Pull Request

1. Ve a tu repositorio en GitHub
2. Verás el banner: *"feature/potencia had recent pushes"* → clic en **Compare & pull request**
3. Título: `feat: agregar función potencia`
4. Descripción: `Agrega la función potencia(base, exponente) con tests`
5. Clic en **Create pull request**

Observa:
- El CI se ejecuta automáticamente en el PR
- El PR muestra los checks: `lint / lint` y `test (3.10)`, `test (3.11)`, `test (3.12)`
- Solo cuando todos los checks pasen podrás mergear

### Paso 7 — Provocar un fallo intencional (y ver cómo se bloquea)

Modifica `src/calculadora.py` y agrega una línea con mala sintaxis de estilo:

```python
def modulo(a,b):   # ← falta espacio después de la coma → flake8 fallará
    return a%b     # ← falta espacios alrededor del operador
```

```bash
git add .
git commit -m "feat: agregar módulo (con errores de estilo)"
git push origin feature/potencia
```

Observa en el PR cómo el job `lint` falla con ❌ y bloquea el merge. El PR muestra:

```
❌ lint / lint   — Some checks were not successful
✅ test (3.10)
✅ test (3.11)
✅ test (3.12)
```

### Paso 8 — Corregir y ver el CI pasar

Corrige el estilo:

```python
def modulo(a, b):
    return a % b
```

```bash
git add .
git commit -m "fix: corregir estilo en función modulo"
git push origin feature/potencia
```

Ahora todos los checks pasan ✅. Mergea el PR desde GitHub UI.

### Paso 9 — Verificar el run post-merge en main

Después del merge, ve a Actions. Verás un nuevo run disparado por el `push` a `main` (el merge commit). El CI corre una vez más en `main` para confirmar que la integración es estable.

---

## 🔍 Conceptos practicados

| Concepto | Descripción |
|----------|-------------|
| **`on: push + pull_request`** | Triggers combinados para CI completo |
| **`branches` filter** | Solo corre en ramas relevantes |
| **Matrix Strategy** | Paralelismo: 3 versiones Python simultáneamente |
| **`needs:`** | El job `test` solo corre si `lint` pasa primero |
| **GitHub Flow** | rama → commit → push → PR → review → merge |
| **Status Checks** | El PR no puede mergearse si el CI falla |
| **`actions/upload-artifact`** | Guardar el reporte de coverage para descargarlo |

---

## 📚 Referencias

- [GitHub Actions — Workflow syntax](https://docs.github.com/en/actions/writing-workflows/workflow-syntax-for-github-actions)
- [Matrix Strategy](https://docs.github.com/en/actions/writing-workflows/choosing-what-your-workflow-does/running-variations-of-jobs-in-a-workflow)
- [GitHub Flow](https://docs.github.com/en/get-started/using-github/github-flow)

---

## ➡️ Siguiente ejercicio

[`../ej-02-custom-action/README.md`](../ej-02-custom-action/README.md)
