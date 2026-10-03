import { copyFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dir = join(root, 'src', 'environments');

const pairs = [
  ['environment.lab.example.ts', 'environment.lab.ts'],
  ['environment.production.example.ts', 'environment.production.ts'],
];

let created = 0;

for (const [template, target] of pairs) {
  const from = join(dir, template);
  const to = join(dir, target);

  if (existsSync(to)) {
    continue;
  }

  if (!existsSync(from)) {
    console.error(`[setup:env] falta la plantilla ${template}`);
    continue;
  }

  copyFileSync(from, to);
  created += 1;
  console.log(`[setup:env] creado ${target} desde ${template} —recordá reemplazar la URL de ejemplo por la real.`);
}

if (created === 0) {
  console.log('[setup:env] todo listo, no hay nada que crear.');
}