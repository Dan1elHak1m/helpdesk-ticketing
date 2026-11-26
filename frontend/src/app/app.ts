import { Component, inject } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from './core/auth.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <header class="topbar">
      <div class="topbar-inner">
        <a routerLink="/tickets" class="brand">
          <span class="brand-mark">HD</span>
          <span>Helpdesk Portal</span>
        </a>

        @if (auth.loggedIn()) {
          <nav class="nav-links">
            <a routerLink="/tickets" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }" class="nav-link">
              Tickets
            </a>
            <a routerLink="/tickets/new" routerLinkActive="active" class="nav-link">
              New Request
            </a>
            @if (auth.role()) {
              <span class="role-pill">{{ auth.role() }}</span>
            }
            <button type="button" class="btn-logout" (click)="auth.logout()">Sign out</button>
          </nav>
        }
      </div>
    </header>

    <main>
      <router-outlet />
    </main>
  `,
})
export class App {
  auth = inject(AuthService);
}