"""
calculadora.py — Módulo de operaciones matemáticas básicas.

Este módulo es usado para demostrar el pipeline CI con pytest y flake8.
"""


def sumar(a, b):
    """Retorna la suma de dos números."""
    return a + b


def restar(a, b):
    """Retorna la diferencia entre dos números."""
    return a - b


def multiplicar(a, b):
    """Retorna el producto de dos números."""
    return a * b


def dividir(a, b):
    """
    Retorna la división de a entre b.

    Raises:
        ValueError: Si b es cero.
    """
    if b == 0:
        raise ValueError("No se puede dividir entre cero")
    return a / b
