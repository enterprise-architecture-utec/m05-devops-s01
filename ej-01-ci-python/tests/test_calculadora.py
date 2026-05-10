"""
test_calculadora.py — Suite de tests para el módulo calculadora.

Ejecutar con: pytest tests/ --verbose
"""
import pytest
from src.calculadora import sumar, restar, multiplicar, dividir


# ── Tests de suma ──────────────────────────────────────────────
class TestSumar:
    def test_suma_enteros_positivos(self):
        assert sumar(2, 3) == 5

    def test_suma_con_negativo(self):
        assert sumar(-1, 5) == 4

    def test_suma_ceros(self):
        assert sumar(0, 0) == 0

    def test_suma_flotantes(self):
        assert sumar(1.5, 2.5) == pytest.approx(4.0)


# ── Tests de resta ─────────────────────────────────────────────
class TestRestar:
    def test_resta_simple(self):
        assert restar(10, 3) == 7

    def test_resta_resultado_negativo(self):
        assert restar(3, 10) == -7


# ── Tests de multiplicación ────────────────────────────────────
class TestMultiplicar:
    def test_multiplicacion_simple(self):
        assert multiplicar(4, 5) == 20

    def test_multiplicacion_por_cero(self):
        assert multiplicar(99, 0) == 0

    def test_multiplicacion_negativos(self):
        assert multiplicar(-3, -4) == 12


# ── Tests de división ──────────────────────────────────────────
class TestDividir:
    def test_division_simple(self):
        assert dividir(10, 2) == 5.0

    def test_division_resultado_decimal(self):
        assert dividir(7, 2) == pytest.approx(3.5)

    def test_division_por_cero_lanza_excepcion(self):
        with pytest.raises(ValueError, match="No se puede dividir entre cero"):
            dividir(5, 0)
