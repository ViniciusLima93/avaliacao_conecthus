/**
 * Regras de formato dos campos do usuário, compartilhadas pelo DTO de entrada
 * (class-validator) e pelo validador de domínio (Joi).
 */

/** Apenas letras (com acentos), com espaço simples entre as palavras. */
export const NAME_PATTERN = /^\p{L}+(?: \p{L}+)*$/u;

/** Apenas dígitos. */
export const REGISTRATION_PATTERN = /^\d+$/;

/** Senha: exatamente 6 caracteres alfanuméricos. */
export const PASSWORD_LENGTH = 6;
export const PASSWORD_PATTERN = /^[A-Za-z0-9]+$/;
