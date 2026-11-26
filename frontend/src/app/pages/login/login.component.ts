import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  template: `
    <div class="card card-auth">
      <div class="card-header">
        <h2>Sign in to Helpdesk</h2>
        <p>Enter your corporate credentials to access support tickets.</p>
      </div>

      <form [formGroup]="form" (ngSubmit)="submit()">
        <div class="field">
          <label for="email">Work email</label>
          <input id="email" type="email" placeholder="name@company.com" formControlName="email" />
          @if (form.controls.email.touched && form.controls.email.invalid) {
            <small class="err">Enter a valid email address</small>
          }
        </div>

        <div class="field">
          <label for="password">Password</label>
          <input id="password" type="password" placeholder="••••••••" formControlName="password" />
          @if (form.controls.password.touched && form.controls.password.invalid) {
            <small class="err">Password is required</small>
          }
        </div>

        @if (error()) {
          <p class="alert-err">{{ error() }}</p>
        }

        <div class="form-actions full">
          <button type="submit" class="btn btn-primary" [disabled]="form.invalid">
            Sign in
          </button>
        </div>
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
      error: () => this.error.set('Invalid email or password. Please try again.'),
    });
  }
}