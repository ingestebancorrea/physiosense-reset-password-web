import {
  PASSWORD_RULES,
  evaluateStrength,
  filledBars,
} from './password-rules';

/**
 * Estas pruebas son la red de seguridad contra el backend: si `ResetPasswordDto`
 * cambia sus reglas, tienen que actualizarse junto con este archivo.
 */
describe('password-rules', () => {
  const passes = (value: string) => PASSWORD_RULES.every((rule) => rule.test(value));

  it('acepta una contraseña que cumple todo', () => {
    expect(passes('Fisio2026')).toBe(true);
  });

  it('rechaza contraseñas demasiado cortas', () => {
    expect(passes('Ab1')).toBe(false);
  });

  it('rechaza las que no tienen mayúscula', () => {
    expect(passes('fisio2026')).toBe(false);
  });

  it('rechaza las que no tienen minúscula', () => {
    expect(passes('FISIO2026')).toBe(false);
  });

  it('acepta un símbolo en lugar de un número', () => {
    expect(passes('FisioSegura!')).toBe(true);
  });

  it('rechaza las que no tienen ni número ni símbolo', () => {
    expect(passes('FisioterapiaClara')).toBe(false);
  });

  describe('evaluateStrength', () => {
    it('degrada a weak cuando está vacía', () => {
      expect(evaluateStrength('')).toBe('weak');
    });

    it('reconoce una contraseña fuerte', () => {
      expect(evaluateStrength('Fisio2026!')).toBe('strong');
    });

    it('reconoce una contraseña débil', () => {
      expect(evaluateStrength('abc')).toBe('weak');
    });
  });

  describe('filledBars', () => {
    it('mapea cada nivel a su cantidad de barras', () => {
      expect(filledBars('weak')).toBe(1);
      expect(filledBars('medium')).toBe(2);
      expect(filledBars('strong')).toBe(3);
    });
  });
});
