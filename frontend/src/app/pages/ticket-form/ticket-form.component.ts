import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { TicketService } from '../../services/ticket.service';

@Component({
  selector: 'app-ticket-form',
  imports: [ReactiveFormsModule, RouterLink],
  template: `
    <div class="card">
      <h2>New ticket</h2>
      <form [formGroup]="form" (ngSubmit)="submit()">
        <label>Title</label>
        <input formControlName="title" />
        @if (c.title.touched && c.title.invalid) {
          <small class="err">Title is required (at least 5 characters)</small>
        }

        <label>Description</label>
        <textarea rows="5" formControlName="description"></textarea>
        @if (c.description.touched && c.description.invalid) {
          <small class="err">Description is required (at least 10 characters)</small>
        }

        <label>Priority</label>
        <select formControlName="priority">
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="urgent">Urgent</option>
        </select>

        @if (error()) { <p class="err">{{ error() }}</p> }
        <button type="submit" [disabled]="form.invalid || saving()">Submit ticket</button>
        <a routerLink="/tickets">Cancel</a>
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
        this.error.set('Could not save the ticket');
        this.saving.set(false);
      },
    });
  }
}