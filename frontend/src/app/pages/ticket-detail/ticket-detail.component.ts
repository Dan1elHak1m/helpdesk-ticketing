import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { TicketService } from '../../services/ticket.service';
import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'app-ticket-detail',
  imports: [FormsModule, RouterLink, DatePipe],
  template: `
    <div class="detail-back">
      <a routerLink="/tickets" class="back-link">&larr; Back to tickets</a>
    </div>

    @if (ticket(); as t) {
      <div class="card card-wide">
        <div class="detail-top">
          <div>
            <span class="td-id">#{{ t.id }}</span>
            <h1 class="detail-title">{{ t.title }}</h1>
          </div>
          <div class="detail-badges">
            <span [class]="'badge ' + t.priority">{{ t.priority }}</span>
            <span [class]="'status-pill ' + t.status">
              <span class="status-dot"></span>
              {{ t.status.replace('_', ' ') }}
            </span>
          </div>
        </div>

        <p class="detail-desc">{{ t.description }}</p>

        <div class="meta-grid">
          <div><strong>Reporter:</strong> {{ t.created_by_name }}</div>
          <div><strong>Created:</strong> {{ t.created_at | date: 'dd MMM yyyy, HH:mm' }}</div>
          <div><strong>Assigned to:</strong> {{ t.assigned_to_name || 'Unassigned' }}</div>
        </div>

        @if (auth.isStaff()) {
          <div class="controls">
            <label class="field">
              <span>Status</span>
              <select [ngModel]="t.status" (ngModelChange)="changeStatus($event)">
                <option value="open">Open</option>
                <option value="in_progress">In progress</option>
                <option value="resolved">Resolved</option>
                <option value="closed">Closed</option>
              </select>
            </label>

            <label class="field">
              <span>Assign to</span>
              <select [ngModel]="t.assigned_to" (ngModelChange)="assign($event)">
                <option [ngValue]="null">Unassigned</option>
                @for (a of agents(); track a.id) {
                  <option [ngValue]="a.id">{{ a.name }}</option>
                }
              </select>
            </label>
          </div>
        }
      </div>

      <section class="comments-section">
        <h2 class="section-heading">Activity &amp; Comments ({{ t.comments.length }})</h2>

        @if (t.comments.length === 0) {
          <div class="card comment-empty">
            <p>No comments yet. Start the conversation below.</p>
          </div>
        }

        @for (c of t.comments; track c.id) {
          <div class="comment">
            <div class="comment-meta">
              <strong>{{ c.user_name }}</strong>
              <small>{{ c.created_at | date: 'dd MMM yyyy, HH:mm' }}</small>
            </div>
            <p>{{ c.message }}</p>
          </div>
        }

        <form (ngSubmit)="sendComment()" class="card comment-form">
          <div class="field">
            <label for="commentBox">Add a reply</label>
            <textarea
              id="commentBox"
              name="comment"
              rows="3"
              placeholder="Write a comment or update..."
              [ngModel]="newComment()"
              (ngModelChange)="newComment.set($event)"
            ></textarea>
          </div>
          <div class="form-actions">
            <button type="submit" class="btn btn-primary" [disabled]="!newComment().trim()">
              Add comment
            </button>
          </div>
        </form>
      </section>
    } @else {
      <div class="card card-wide">
        <p class="page-subtitle">Loading ticket details...</p>
      </div>
    }
  `,
})
export class TicketDetailComponent implements OnInit {
  private svc = inject(TicketService);
  private route = inject(ActivatedRoute);
  auth = inject(AuthService);

  id = Number(this.route.snapshot.paramMap.get('id'));
  ticket = signal<any | null>(null);
  agents = signal<{ id: number; name: string }[]>([]);
  newComment = signal('');

  ngOnInit() {
    this.load();
    if (this.auth.isStaff()) {
      this.svc.agents().subscribe(a => this.agents.set(a));
    }
  }

  load() {
    this.svc.get(this.id).subscribe(t => this.ticket.set(t));
  }

  changeStatus(status: string) {
    this.svc.update(this.id, { status }).subscribe(() => this.load());
  }

  assign(userId: number | null) {
    this.svc.update(this.id, { assigned_to: userId }).subscribe(() => this.load());
  }

  sendComment() {
    const message = this.newComment().trim();
    if (!message) return;
    this.svc.addComment(this.id, message).subscribe(() => {
      this.newComment.set('');
      this.load();
    });
  }
}