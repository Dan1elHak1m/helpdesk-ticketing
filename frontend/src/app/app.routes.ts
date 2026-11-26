import { Routes } from '@angular/router';
import { authGuard } from './core/auth.guard';
import { LoginComponent } from './pages/login/login.component';
import { TicketListComponent } from './pages/ticket-list/ticket-list.component';
import { TicketFormComponent } from './pages/ticket-form/ticket-form.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'tickets', component: TicketListComponent, canActivate: [authGuard] },
  { path: 'tickets/new', component: TicketFormComponent, canActivate: [authGuard] },
  { path: '', pathMatch: 'full', redirectTo: 'tickets' },
  { path: '**', redirectTo: 'tickets' },
];