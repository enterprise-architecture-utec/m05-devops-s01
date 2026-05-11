# 🚀 Lab — GitHub Actions: CI, Codespaces y Custom Actions

**Curso:** Arquitectura de Soluciones Multinube  
**Módulo 5, Sesión 1:** Ecosistema GitHub y Workflows Modernos  
**Docente:** Aldo Trucios — UTEC Posgrado  
**Duración total:** ~50 minutos

---

## 🎯 ¿Qué aprenderás?

Tres ejercicios progresivos que cubren el ecosistema GitHub completo: desde un pipeline CI profesional hasta la creación de Custom Actions reutilizables para toda una organización.

---

## 🗺️ Mapa del laboratorio

```
┌─────────────────────────────────────────────────────────────────┐
│  EJ-01 · 25 min · CI con Python + GitHub Flow                   │
│                                                                 │
│  feature/suma ──► main                                          │
│       │                                                         │
│       └──► Workflow CI (push + PR)                              │
│               ├── lint (flake8)                                 │
│               ├── test matrix (Python 3.10, 3.11, 3.12)         │
│               └── coverage report                               │

├─────────────────────────────────────────────────────────────────┤
│  EJ-02 · 25 min · Custom Composite Action                       │
│                                                                 │
│  .github/actions/notify-and-tag/                                │
│       action.yml  ←── Custom Composite Action                   │
│           ├── input: version, environment, slack_webhook        │
│           ├── step: crear git tag                               │
│           ├── step: generar release notes                       │
│           └── step: notificar (simulated)                       │
│                                                                 │
│  .github/workflows/release.yml  ←── consume la Action           │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📁 Estructura del Repositorio

```
m05-github-actions-lab/
│
├── README.md                          ← Este archivo
│
├── ej-01-ci-python/                   ← Ejercicio 1: CI + GitHub Flow
│   ├── README.md
│   ├── .github/workflows/
│   │   └── ci.yml
│   ├── src/
│   │   └── calculadora.py
│   └── tests/
│       └── test_calculadora.py
│
└── ej-02-custom-action/               ← Ejercicio 3: Custom Action
    ├── README.md
    ├── .github/
    │   ├── actions/
    │   │   └── notify-and-tag/
    │   │       ├── action.yml         ← La Custom Composite Action
    │   │       └── README.md
    │   └── workflows/
    │       └── release.yml            ← Workflow que la consume
    └── src/
        └── app.py
```

---

## ⚙️ Prerequisitos

| Herramienta | Dónde se usa |
|-------------|--------------|
| Cuenta GitHub (free) | Todos los ejercicios |
| Repositorio público propio | Todos los ejercicios |
| Git instalado localmente | EJ-01, EJ-03 |
| Python 3.10+ | EJ-01 (opcional local) |

---

## 🗺️ Flujo de cada ejercicio

Cada ejercicio sigue el mismo patrón:

```
1. Clonar / crear el repo en GitHub
2. Leer el README del ejercicio
3. Copiar los archivos al repo
4. Hacer push → observar el workflow en la pestaña Actions
5. Provocar un fallo intencional → corregir → observar el fix
```

---

> 🚀 **Comienza por:** [`ej-01-ci-python/README.md`](ej-01-ci-python/README.md)
