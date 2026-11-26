import { Component, inject } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { AuthService } from './core/auth.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink],
  template: `
    <nav>
      <strong>Helpdesk</strong>
      @if (auth.loggedIn()) {
        <a routerLink="/tickets">Tickets</a>
        <button (click)="auth.logout()">Logout</button>
      }
    </nav>
    <main><router-outlet /></main>
  `,
})
export class App {
  auth = inject(AuthService);
}