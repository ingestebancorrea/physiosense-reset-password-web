/**
 * Configuración por defecto (desarrollo local contra `ng serve`).
 * Este archivo se versiona y sólo contiene valores de localhost.
 *
 * Las URLs reales de laboratorio y producción viven en `environment.lab.ts` y
 * `environment.production.ts`, que están ignorados por git. Crearlos una vez
 * con `npm run setup:env` (o copiando los `.example`).
 */
export const API_BASE_URL = 'http://localhost:3000/api/v1';