import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { API_BASE_URL } from '../../environments/environment';

export interface ResetPasswordPayload {
  token: string;
  password: string;
  confirm_password: string;
}

export interface ResetPasswordResponse {
  message: string;
}

/**
 * Forma de error que devuelve `AllExceptionsFilter` en el backend
 * (src/common/filters/all-exceptions.filter.ts). `message` es string cuando la
 * excepción trae un texto propio y string[] cuando falla el `ValidationPipe`.
 */
export interface ApiError {
  statusCode: number;
  message: string | string[];
  error?: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);

  resetPassword(payload: ResetPasswordPayload): Observable<ResetPasswordResponse> {
    return this.http.post<ResetPasswordResponse>(`${API_BASE_URL}/auth/reset-password`, payload);
  }
}
