import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { MessageService } from 'primeng/api';

export const roleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const messageService = inject(MessageService);
  const router = inject(Router);

  const expectedRole = route.data['expectedRole'];

  if (authService.isLoggedIn() && (authService.getUserRole() === expectedRole || authService.getUserRole() == 'admin') ) {
    return true;
  } else {
    messageService.add({ severity: 'info', summary: 'You do not have permission to access this page.' });
    router.navigate(['/login']);
    return false;
  }
};
