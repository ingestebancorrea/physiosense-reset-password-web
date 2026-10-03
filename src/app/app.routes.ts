import { Routes } from '@angular/router';

import { ResetPassword } from './features/reset-password/reset-password';

/**
 * El backend arma el enlace del correo como `{PASSWORD_RECOVERY_FRONTEND_URL}/reset-password`,
 * así que esta ruta tiene que coincidir exactamente con ese path.
 */
export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'reset-password' },
  { path: 'reset-password', component: ResetPassword },
  { path: '**', redirectTo: 'reset-password' },
];
