import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { TicketService } from '../../services/ticket.service';

@Component({
  selector: 'app-ticket-list',
  imports: [FormsModule, RouterLink, DatePipe],
  template: `
    <div class="bar">
      <h2>Tickets</h2>
      <a routerLink="/tickets/new" class="btn">New ticket</a>
    </div>

    <select [ngModel]="status()" (ngModelChange)="setStatus($event)">
      <option value="">All statuses</option>
      <option value="open">Open</option>
      <option value="in_progress">In progress</option>
      <option value="resolved">Resolved</option>
      <option value="closed">Closed</option>
    </select>

    @if (tickets().length === 0) {
      <p>No tickets found.</p>
    } @else {
      <table>
        <thead>
          <tr><th>#</th><th>Title</th><th>Priority</th><th>Status</th><th>Created</th></tr>
        </thead>
        <tbody>
          @for (t of tickets(); track t.id) {
            <tr>
              <td>{{ t.id }}</td>
              <td>{{ t.title }}</td>
              <td><span [class]="'badge ' + t.priority">{{ t.priority }}</span></td>
              <td>{{ t.status }}</td>
              <td>{{ t.created_at | date: 'dd MMM yyyy' }}</td>
            </tr>
          }
        </tbody>
      </table>
    }
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
}