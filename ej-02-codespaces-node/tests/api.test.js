"use strict";

const { crearRespuesta, validarEmail, calcularDescuento } = require("../src/api");

// ── Tests de crearRespuesta ────────────────────────────────────
describe("crearRespuesta", () => {
  test("retorna objeto con status, data y timestamp", () => {
    const resultado = crearRespuesta(200, { mensaje: "ok" });
    expect(resultado.status).toBe(200);
    expect(resultado.data).toEqual({ mensaje: "ok" });
    expect(resultado.timestamp).toBeDefined();
  });

  test("funciona con status 404", () => {
    const resultado = crearRespuesta(404, null);
    expect(resultado.status).toBe(404);
    expect(resultado.data).toBeNull();
  });

  test("lanza error si el status code es inválido", () => {
    expect(() => crearRespuesta(99, {})).toThrow("Status code inválido");
    expect(() => crearRespuesta(600, {})).toThrow("Status code inválido");
  });
});

// ── Tests de validarEmail ──────────────────────────────────────
describe("validarEmail", () => {
  test("valida email correcto", () => {
    expect(validarEmail("alumno@utec.edu.pe")).toBe(true);
  });

  test("rechaza email sin @", () => {
    expect(validarEmail("alumno.utec.edu.pe")).toBe(false);
  });

  test("rechaza email sin dominio", () => {
    expect(validarEmail("alumno@")).toBe(false);
  });

  test("rechaza cadena vacía", () => {
    expect(validarEmail("")).toBe(false);
  });

  test("rechaza tipos no string", () => {
    expect(validarEmail(null)).toBe(false);
    expect(validarEmail(123)).toBe(false);
  });
});

// ── Tests de calcularDescuento ─────────────────────────────────
describe("calcularDescuento", () => {
  test("aplica 10% de descuento correctamente", () => {
    expect(calcularDescuento(100, 10)).toBe(90);
  });

  test("descuento 0% retorna precio original", () => {
    expect(calcularDescuento(250, 0)).toBe(250);
  });

  test("descuento 100% retorna 0", () => {
    expect(calcularDescuento(100, 100)).toBe(0);
  });

  test("maneja precios decimales", () => {
    expect(calcularDescuento(99.99, 20)).toBe(79.99);
  });

  test("lanza error si precio es negativo", () => {
    expect(() => calcularDescuento(-10, 10)).toThrow("precio no puede ser negativo");
  });

  test("lanza error si porcentaje es mayor a 100", () => {
    expect(() => calcularDescuento(100, 150)).toThrow("entre 0 y 100");
  });
});
