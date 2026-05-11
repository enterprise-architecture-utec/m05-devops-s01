"""
app.py — Aplicación de ejemplo para el ejercicio EJ-03.

Esta aplicación representa el código que se "lanza" en cada release.
El pipeline de release crea un tag git, genera release notes
y notifica al equipo usando la Custom Action notify-and-tag.
"""

__version__ = "1.0.0"
__author__ = "UTEC Posgrado"


def obtener_version():
    """Retorna la versión actual de la aplicación."""
    return __version__


def saludar(nombre: str) -> str:
    """
    Retorna un saludo personalizado.

    Args:
        nombre: Nombre de la persona a saludar.

    Returns:
        Cadena de saludo con la versión de la app.
    """
    if not nombre or not nombre.strip():
        raise ValueError("El nombre no puede estar vacío")
    return f"Hola, {nombre.strip()}! — App v{__version__}"


if __name__ == "__main__":
    print(saludar("UTEC"))
    print(f"Versión: {obtener_version()}")
