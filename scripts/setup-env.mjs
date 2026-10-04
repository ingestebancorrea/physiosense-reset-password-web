import { copyFileSync, existsSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dir = join(root, 'src', 'environments');

const PLACEHOLDERS = ['ejemplo-physiosense.com', 'PENDIENTE'];

const targets = [
  {
    template: 'environment.lab.example.ts',
    target: 'environment.lab.ts',
    envVar: 'API_BASE_URL_LAB',
  },
  {
    template: 'environment.production.example.ts',
    target: 'environment.production.ts',
    envVar: 'API_BASE_URL_PRODUCTION',
  },
];

let created = 0;

for (const { template, target, envVar } of targets) {
  const from = join(dir, template);
  const to = join(dir, target);

  if (!existsSync(from)) {
    console.error(`[setup:env] falta la plantilla ${template}`);
    continue;
  }

  // Una URL explícita del entorno gana sobre la plantilla: es lo que hace que
  // `API_BASE_URL` en Vercel/CI llegue de verdad al bundle. `API_BASE_URL` es
  // el valor genérico; `API_BASE_URL_LAB` / `API_BASE_URL_PRODUCTION` permiten
  // diferenciar una URL por configuración de build.
  const source = process.env[envVar] ? envVar : 'API_BASE_URL';
  const baseUrl = process.env[source]?.trim();

  if (baseUrl) {
    const value = baseUrl.replace(/\/+$/, '');
    writeFileSync(to, `export const API_BASE_URL = '${value}';\n`);
    console.log(`[setup:env] ${target} escrito desde ${source} (${value}).`);
    continue;
  }

  if (existsSync(to)) {
    continue;
  }

  copyFileSync(from, to);
  created += 1;
  console.log(
    `[setup:env] creado ${target} desde ${template} —recordá reemplazar la URL de ejemplo por la real.`,
  );
}

if (created === 0) {
  console.log('[setup:env] todo listo, no hay nada que crear.');
}

// `API_BASE_URL` es una constante de compilación: si el bundle se publica con la
// URL de ejemplo, el frontend queda apuntando a un host inexistente y sólo se
// descubre en producción. En CI es un error de deploy, no un warning.
//
// Se valida sólo el archivo de la configuración que se está compilando: un
// deploy de lab no necesita conocer la URL de producción. Sin argumento
// (postinstall) no se valida nada, porque ahí no se sabe qué configuración va a
// compilarse.
const requested = process.argv[2];
const toValidate = requested
  ? targets.filter(({ target }) => target === `environment.${requested}.ts`)
  : [];

if (toValidate.length === 0) {
  if (requested) {
    console.error(`[setup:env] configuración desconocida: ${requested}`);
    process.exit(1);
  }
} else if (process.env.CI || process.env.VERCEL) {
  const placeholders = toValidate
    .map(({ target }) => target)
    .filter((target) => {
      const file = join(dir, target);
      if (!existsSync(file)) {
        return false;
      }
      const contents = readFileSync(file, 'utf8');
      return PLACEHOLDERS.some((placeholder) => contents.includes(placeholder));
    });

  if (placeholders.length > 0) {
    console.error(
      `[setup:env] CI detectado y ${placeholders.join(', ')} todavía tiene una URL de ejemplo.`,
    );
    console.error(
      `[setup:env] definí API_BASE_URL o API_BASE_URL_${requested.toUpperCase()} en las variables de entorno del deploy.`,
    );
    process.exit(1);
  }
}
