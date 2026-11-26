import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  template: `
    <div class="card">
      <h2>Helpdesk login</h2>
      <form [formGroup]="form" (ngSubmit)="submit()">
        <label>Email</label>
        <input type="email" formControlName="email" />
        @if (form.controls.email.touched && form.controls.email.invalid) {
          <small class="err">Enter a valid email</small>
        }

        <label>Password</label>
        <input type="password" formControlName="password" />
        @if (form.controls.password.touched && form.controls.password.invalid) {
          <small class="err">Password is required</small>
        }

        @if (error()) { <p class="err">{{ error() }}</p> }
        <button type="submit" [disabled]="form.invalid">Log in</button>
      </form>
    </div>
  `,
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);

  error = signal('');

  form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  submit() {
    const { email, password } = this.form.getRawValue();
    this.auth.login(email, password).subscribe({
      next: () => this.router.navigate(['/tickets']),
      error: () => this.error.set('Wrong email or password'),
    });
  }
}