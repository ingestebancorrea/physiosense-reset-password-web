/**
 * Reglas de contraseña.
 *
 * Réplica exacta de las que impone `ResetPasswordDto` en el backend
 * (src/auth/dto/reset-password.dto.ts): mínimo 6, máximo 150, mayúscula y
 * minúscula, y al menos un número o símbolo.
 *
 * Si cambiás la validación del backend, actualizá acá también: el placeholder
 * solo valida por UX y no reemplaza al `ValidationPipe`.
 */
export interface PasswordRule {
  id: string;
  label: string;
  test: (value: string) => boolean;
}

export const PASSWORD_MIN_LENGTH = 6;
export const PASSWORD_MAX_LENGTH = 150;

export const PASSWORD_RULES: PasswordRule[] = [
  {
    id: 'length',
    label: `Al menos ${PASSWORD_MIN_LENGTH} caracteres`,
    test: (value) => value.length >= PASSWORD_MIN_LENGTH,
  },
  {
    id: 'case',
    label: 'Incluye mayúsculas y minúsculas',
    test: (value) => /[a-z]/.test(value) && /[A-Z]/.test(value),
  },
  {
    id: 'numberOrSymbol',
    label: 'Al menos un número o símbolo',
    test: (value) => /[\d\W]/.test(value),
  },
];

export type StrengthLevel = 'weak' | 'medium' | 'strong';

export const STRENGTH_META: Record<StrengthLevel, { label: string; color: string }> = {
  weak: { label: 'Débil', color: '#E74C3C' },
  medium: { label: 'Media', color: '#F59E0B' },
  strong: { label: 'Fuerte', color: '#2ECC71' },
};

/** Semáforo de seguridad. Extrapola un poco más allá de los requisitos. */
export function evaluateStrength(value: string): StrengthLevel {
  if (!value) {
    return 'weak';
  }

  let score = 0;
  if (value.length >= 8) score += 1;
  if (value.length >= 12) score += 1;
  if (/[a-z]/.test(value) && /[A-Z]/.test(value)) score += 1;
  if (/\d/.test(value)) score += 1;
  if (/[^A-Za-z0-9]/.test(value)) score += 1;

  if (score <= 2) return 'weak';
  if (score <= 3) return 'medium';
  return 'strong';
}

/** Cuántas de las tres barras del semáforo quedan llenas. */
export function filledBars(level: StrengthLevel): number {
  return { weak: 1, medium: 2, strong: 3 }[level];
}
