import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { TicketService } from '../../services/ticket.service';

@Component({
  selector: 'app-ticket-form',
  imports: [ReactiveFormsModule, RouterLink],
  template: `
    <div class="card card-form">
      <div class="card-header">
        <h2>Submit a Support Request</h2>
        <p>Provide clear details so our support team can route and resolve your issue quickly.</p>
      </div>

      <form [formGroup]="form" (ngSubmit)="submit()">
        <div class="field">
          <label for="title">Subject</label>
          <input id="title" placeholder="Brief summary of the issue" formControlName="title" />
          @if (c.title.touched && c.title.invalid) {
            <small class="err">Subject is required (at least 5 characters)</small>
          }
        </div>

        <div class="field">
          <label for="priority">Priority level</label>
          <select id="priority" formControlName="priority">
            <option value="low">Low — Minor question or cosmetic issue</option>
            <option value="medium">Medium — Standard support request</option>
            <option value="high">High — Workflow blocked or degraded</option>
            <option value="urgent">Urgent — Critical system outage</option>
          </select>
        </div>

        <div class="field">
          <label for="description">Description</label>
          <textarea
            id="description"
            rows="5"
            placeholder="Include steps to reproduce, error messages, or affected systems..."
            formControlName="description"
          ></textarea>
          @if (c.description.touched && c.description.invalid) {
            <small class="err">Description is required (at least 10 characters)</small>
          }
        </div>

        @if (error()) {
          <p class="alert-err">{{ error() }}</p>
        }

        <div class="form-actions">
          <button type="submit" class="btn btn-primary" [disabled]="form.invalid || saving()">
            {{ saving() ? 'Submitting...' : 'Submit request' }}
          </button>
          <a routerLink="/tickets" class="btn btn-secondary">Cancel</a>
        </div>
      </form>
    </div>
  `,
})
export class TicketFormComponent {
  private fb = inject(FormBuilder);
  private svc = inject(TicketService);
  private router = inject(Router);

  saving = signal(false);
  error = signal('');

  form = this.fb.nonNullable.group({
    title: ['', [Validators.required, Validators.minLength(5)]],
    description: ['', [Validators.required, Validators.minLength(10)]],
    priority: ['medium'],
  });

  get c() {
    return this.form.controls;
  }

  submit() {
    this.saving.set(true);
    this.svc.create(this.form.getRawValue()).subscribe({
      next: () => this.router.navigate(['/tickets']),
      error: () => {
        this.error.set('Could not save the ticket. Please try again.');
        this.saving.set(false);
      },
    });
  }
}