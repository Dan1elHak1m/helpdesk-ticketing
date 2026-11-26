import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

// Guard for authenticated users
export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  return auth.loggedIn()
    ? true
    : router.createUrlTree(['/login']);
};

// Guard for staff-only routes
export const staffGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (!auth.loggedIn()) {
    return router.createUrlTree(['/login']);
  }

  if (!auth.isStaff()) {
    return router.createUrlTree(['/tickets']);
  }

  return true;
};