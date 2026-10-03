import { HttpErrorResponse } from '@angular/common/http';
import { Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { ApiError, AuthService } from '../../core/auth.service';
import {
  PASSWORD_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
  PASSWORD_RULES,
  STRENGTH_META,
  evaluateStrength,
  filledBars,
} from '../../core/password-rules';

/**
 * Expresión copiada tal cual de `@Matches()` en `ResetPasswordDto`. Se mantiene
 * sin anclas a propósito: cualquier diferencia con el backend haría que el
 * formulario acepte contraseñas que el microservicio va a rechazar.
 */
const PASSWORD_PATTERN = /(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/;

type FieldName = 'password' | 'confirm_password';

/** Traduce la respuesta de `AllExceptionsFilter` a algo mostrable. */
function readableError(err: HttpErrorResponse): string {
  if (err.status === 0) {
    return 'No pudimos conectar con el servidor. Revisá tu conexión a internet.';
  }

  const message = (err.error as ApiError | undefined)?.message;

  if (Array.isArray(message)) {
    return message.join(' ');
  }

  return message ?? 'No se pudo restablecer la contraseña. Intentá más tarde.';
}

@Component({
  selector: 'app-reset-password',
  imports: [ReactiveFormsModule],
  templateUrl: './reset-password.html',
  styleUrl: './reset-password.scss',
})
export class ResetPassword {
  private readonly route = inject(ActivatedRoute);
  private readonly formBuilder = inject(FormBuilder);
  private readonly authService = inject(AuthService);

  readonly passwordMaxLength = PASSWORD_MAX_LENGTH;
  readonly strengthLevels = ['weak', 'medium', 'strong'] as const;

  /** Token que el backend manda en el query string del enlace del correo. */
  readonly token = this.route.snapshot.queryParamMap.get('token')?.trim() ?? '';

  readonly form = this.formBuilder.nonNullable.group({
    password: [
      '',
      [
        Validators.required,
        Validators.minLength(PASSWORD_MIN_LENGTH),
        Validators.maxLength(PASSWORD_MAX_LENGTH),
        Validators.pattern(PASSWORD_PATTERN),
      ],
    ],
    confirm_password: ['', [Validators.required]],
  });

  /** Espejo del valor del campo, para que la lista de reglas sea reactiva. */
  protected readonly passwordValue = signal('');
  private readonly visibility = signal<Record<FieldName, boolean>>({
    password: false,
    confirm_password: false,
  });

  readonly submitting = signal(false);
  readonly done = signal(false);
  readonly serverError = signal<string | null>(null);

  readonly rules = computed(() =>
    PASSWORD_RULES.map((rule) => ({ ...rule, met: rule.test(this.passwordValue()) })),
  );

  readonly strength = computed(() => evaluateStrength(this.passwordValue()));
  readonly strengthMeta = computed(() => STRENGTH_META[this.strength()]);
  readonly barsFilled = computed(() => filledBars(this.strength()));

  readonly mismatched = computed(
    () =>
      this.form.controls.confirm_password.touched &&
      !!this.form.controls.confirm_password.value &&
      this.form.controls.password.value !== this.form.controls.confirm_password.value,
  );

  readonly canSubmit = computed(
    () =>
      this.form.valid &&
      this.allRulesMet() &&
      this.form.controls.password.value === this.form.controls.confirm_password.value,
  );

  private readonly allRulesMet = computed(() => this.rules().every((rule) => rule.met));

  isVisible(field: FieldName): boolean {
    return this.visibility()[field];
  }

  toggleVisibility(field: FieldName): void {
    this.visibility.update((current) => ({ ...current, [field]: !current[field] }));
  }

  onPasswordInput(value: string): void {
    this.passwordValue.set(value);
  }

  invalid(field: FieldName): boolean {
    const control = this.form.controls[field];
    return control.touched && control.invalid;
  }

  barIsFilled(level: (typeof this.strengthLevels)[number]): boolean {
    return this.barsFilled() > this.strengthLevels.indexOf(level);
  }

  submit(): void {
    this.serverError.set(null);

    if (!this.canSubmit()) {
      this.form.markAllAsTouched();
      return;
    }

    const { password, confirm_password } = this.form.getRawValue();

    this.submitting.set(true);
    this.authService.resetPassword({ token: this.token, password, confirm_password }).subscribe({
      next: () => {
        this.submitting.set(false);
        this.done.set(true);
      },
      error: (err: HttpErrorResponse) => {
        this.submitting.set(false);
        this.serverError.set(readableError(err));
      },
    });
  }
}
