/**
 * Paleta de PhysioSense.
 *
 * Copia de `src/constants/theme.ts` de la app mobile (C:\PhysioSenseMobileUi)
 * para que esta página se vea igual que el resto del producto.
 */
export const COLORS = {
  primary: '#5A4FCF',
  primaryDark: '#4538B0',
  primarySoft: '#ECEBFA',
  success: '#2ECC71',
  successSoft: '#E8F8F0',
  warning: '#F5A623',
  danger: '#E5484D',
  dangerSoft: '#FDEBEC',
  background: '#FFFFFF',
  surface: '#FFFFFF',
  cardBackground: '#FFFFFF',
  white: '#FFFFFF',
  cardSoft: '#F8F9FE',
  textPrimary: '#333333',
  textSecondary: '#666666',
  textMuted: '#8E8E93',
  border: '#E2E8F0',
  divider: '#EFEFEF',
  progressTrack: '#EEEEF3',
  shadow: '#000000',
  violet: '#4F46E5',
  violetSoft: '#F5F3FF',
  backgroundMuted: '#FAFAFC',
  borderSubtle: '#F1F5F9',
  textSubtitle: '#64748B',
  blue: '#2563EB',
  blueSoft: '#DBEAFE',
  skyBlue: '#0284C7',
  skyBlueSoft: '#E0F2FE',
  warningAmber: '#F59E0B',
  warningAmberSoft: '#FEF9C3',
  inactive: '#5F6368',
  inactiveSoft: '#F1F3F4',
  active: '#1E8E3E',
  activeSoft: '#E6F4EA',
  orange: '#FF9800',
  primaryViolet: '#6C5CE7',
  primaryVioletSoft: '#EFEDFF',
  surfaceSoft: '#F4F5FB',
  backgroundLight: '#F8F9FA',
  textStrong: '#1E1E2C',
  textNeutral: '#5A5A63',
  dangerRed: '#E74C3C',
  dangerRedSoft: '#FFF0F0',
  dividerLight: '#F0F0F0',
  switchOff: '#E0E0E0',
} as const;

/** Fondo de página en las pantallas de seguridad del mobile. */
export const PAGE_BACKGROUND = '#f1f4f8';

/** Violeta de marca usado en el encabezado del flujo de recuperación. */
export const BRAND_VIOLET = '#6236FF';

export type ColorToken = keyof typeof COLORS;
