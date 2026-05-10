"use strict";

/**
 * api.js — Módulo de utilidades para una API REST.
 *
 * Funciones puras (sin servidor) para facilitar el testing con Jest.
 * Usado en el ejercicio EJ-02 del laboratorio GitHub Actions.
 */

/**
 * Crea un objeto de respuesta estándar para la API.
 * @param {number} statusCode - Código HTTP (200, 400, 404, 500...)
 * @param {*} datos - Payload de la respuesta
 * @returns {{ status: number, data: *, timestamp: string }}
 */
function crearRespuesta(statusCode, datos) {
  if (typeof statusCode !== "number" || statusCode < 100 || statusCode > 599) {
    throw new Error(`Status code inválido: ${statusCode}`);
  }
  return {
    status: statusCode,
    data: datos,
    timestamp: new Date().toISOString(),
  };
}

/**
 * Valida si un email tiene formato correcto.
 * @param {string} email
 * @returns {boolean}
 */
function validarEmail(email) {
  if (typeof email !== "string") return false;
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email.trim());
}

/**
 * Calcula el precio con descuento aplicado.
 * @param {number} precio - Precio original
 * @param {number} porcentaje - Porcentaje de descuento (0–100)
 * @returns {number} Precio con descuento
 */
function calcularDescuento(precio, porcentaje) {
  if (precio < 0) throw new Error("El precio no puede ser negativo");
  if (porcentaje < 0 || porcentaje > 100) {
    throw new Error("El porcentaje debe estar entre 0 y 100");
  }
  const descuento = precio * (porcentaje / 100);
  return Math.round((precio - descuento) * 100) / 100;
}

module.exports = { crearRespuesta, validarEmail, calcularDescuento };
