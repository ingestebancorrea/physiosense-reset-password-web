import { provideHttpClient } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap } from '@angular/router';

import { ResetPassword } from './reset-password';

describe('ResetPassword', () => {
  let fixture: ComponentFixture<ResetPassword>;

  const build = async (token: string | null) => {
    await TestBed.configureTestingModule({
      imports: [ResetPassword],
      providers: [
        provideHttpClient(),
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { queryParamMap: convertToParamMap(token ? { token } : {}) },
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ResetPassword);
    fixture.detectChanges();
  };

  const typeOf = (id: 'password' | 'confirm_password'): string | undefined => {
    const input = fixture.nativeElement.querySelector(`#${id}`) as HTMLInputElement | null;
    return input?.type;
  };

  const clickToggle = (id: 'password' | 'confirm_password') => {
    const box = fixture.nativeElement.querySelector(`#${id}`)!.nextElementSibling;
    (box as HTMLElement).click();
    fixture.detectChanges();
  };

  describe('visibility toggle', () => {
    it('starts with both password fields hidden', async () => {
      await build('abc123');

      expect(typeOf('password')).toBe('password');
      expect(typeOf('confirm_password')).toBe('password');
    });

    it('reveals and hides the new password field', async () => {
      await build('abc123');

      clickToggle('password');
      expect(typeOf('password')).toBe('text');

      clickToggle('password');
      expect(typeOf('password')).toBe('password');
    });

    it('reveals and hides the confirm password field', async () => {
      await build('abc123');

      clickToggle('confirm_password');
      expect(typeOf('confirm_password')).toBe('text');

      clickToggle('confirm_password');
      expect(typeOf('confirm_password')).toBe('password');
    });

    it('toggles each field independently', async () => {
      await build('abc123');

      clickToggle('password');

      expect(typeOf('password')).toBe('text');
      expect(typeOf('confirm_password')).toBe('password');
    });
  });

  describe('missing token', () => {
    it('does not render the form', async () => {
      await build(null);

      const text = (fixture.nativeElement.textContent as string).replace(/\s+/g, ' ');
      expect(text).toContain('Enlace incompleto');
      expect(fixture.nativeElement.querySelector('#password')).toBeNull();
    });
  });
});
