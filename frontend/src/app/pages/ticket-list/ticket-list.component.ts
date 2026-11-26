import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { TicketService } from '../../services/ticket.service';

@Component({
  selector: 'app-ticket-list',
  imports: [FormsModule, RouterLink, DatePipe],
  template: `
    <div class="page-header">
      <div>
        <h1 class="page-title">Support Tickets</h1>
        <p class="page-subtitle">Track, filter, and manage active support requests.</p>
      </div>
      <a routerLink="/tickets/new" class="btn btn-primary">+ New ticket</a>
    </div>

    <div class="table-panel">
      <div class="toolbar">
        <div class="toolbar-left">
          <label for="statusFilter">Status:</label>
          <select id="statusFilter" [ngModel]="status()" (ngModelChange)="setStatus($event)">
            <option value="">All statuses</option>
            <option value="open">Open</option>
            <option value="in_progress">In progress</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
          </select>
        </div>
        <span class="ticket-count">
          Showing {{ tickets().length }} {{ tickets().length === 1 ? 'ticket' : 'tickets' }}
        </span>
      </div>

      @if (tickets().length === 0) {
        <div class="empty-state">
          <h3>No tickets found</h3>
          <p>There are no support requests matching the current filter.</p>
          <a routerLink="/tickets/new" class="btn btn-primary">Create a ticket</a>
        </div>
      } @else {
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Subject</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Created</th>
              </tr>
            </thead>
            <tbody>
              @for (t of tickets(); track t.id) {
                <tr>
                  <td class="td-id">#{{ t.id }}</td>
                  <td class="td-title">{{ t.title }}</td>
                  <td><span [class]="'badge ' + t.priority">{{ t.priority }}</span></td>
                  <td>
                    <span [class]="'status-pill ' + t.status">
                      <span class="status-dot"></span>
                      {{ formatStatus(t.status) }}
                    </span>
                  </td>
                  <td class="td-date">{{ t.created_at | date: 'dd MMM yyyy' }}</td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      }
    </div>
  `,
})
export class TicketListComponent implements OnInit {
  private svc = inject(TicketService);

  tickets = signal<any[]>([]);
  status = signal('');

  ngOnInit() {
    this.load();
  }

  setStatus(value: string) {
    this.status.set(value);
    this.load();
  }

  load() {
    this.svc.list(this.status()).subscribe(rows => this.tickets.set(rows));
  }

  formatStatus(status: string): string {
    return status.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase());
  }
}