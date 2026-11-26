import { Component, OnInit, inject, signal } from '@angular/core';
import { TicketService } from '../../services/ticket.service';

@Component({
  selector: 'app-dashboard',
  template: `
    <div class="page-header">
      <div>
        <h1 class="page-title">Operations Dashboard</h1>
        <p class="page-subtitle">Live ticket volume breakdown across workflow statuses and priority tiers.</p>
      </div>
    </div>

    <h2 class="section-heading">Tickets by status</h2>
    <div class="stats-grid">
      @for (s of statuses; track s.key) {
        <div class="stat-card">
          <div class="stat-num">{{ statusCount(s.key) }}</div>
          <div class="stat-label">{{ s.label }}</div>
        </div>
      }
    </div>

    <h2 class="section-heading">Tickets by priority</h2>
    <div class="stats-grid">
      @for (p of priorities; track p.key) {
        <div class="stat-card">
          <div class="stat-num">{{ priorityCount(p.key) }}</div>
          <div class="stat-label">{{ p.label }}</div>
        </div>
      }
    </div>
  `,
})
export class DashboardComponent implements OnInit {
  private svc = inject(TicketService);

  statuses = [
    { key: 'open', label: 'Open' },
    { key: 'in_progress', label: 'In progress' },
    { key: 'resolved', label: 'Resolved' },
    { key: 'closed', label: 'Closed' },
  ];

  priorities = [
    { key: 'low', label: 'Low' },
    { key: 'medium', label: 'Medium' },
    { key: 'high', label: 'High' },
    { key: 'urgent', label: 'Urgent' },
  ];

  byStatus = signal<Record<string, number>>({});
  byPriority = signal<Record<string, number>>({});

  ngOnInit() {
    this.svc.stats().subscribe(r => {
      this.byStatus.set(Object.fromEntries(r.byStatus.map(x => [x.status, Number(x.count)])));
      this.byPriority.set(Object.fromEntries(r.byPriority.map(x => [x.priority, Number(x.count)])));
    });
  }

  statusCount(key: string) {
    return this.byStatus()[key] ?? 0;
  }

  priorityCount(key: string) {
    return this.byPriority()[key] ?? 0;
  }
}