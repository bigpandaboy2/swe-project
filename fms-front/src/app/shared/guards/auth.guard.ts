import {CanActivateFn, Router} from '@angular/router';
import {inject} from '@angular/core';
import {AuthService} from '../services/auth.service';
import {MessageService} from 'primeng/api';

export const authGuard: CanActivateFn = (
  route, state) => {
  const authService = inject(AuthService);
  const messageService = inject(MessageService)
  const router = inject(Router);

  if (authService.isLoggedIn()) {
    return true
  } else {
    messageService.add({severity: 'info', summary: 'You are not logged in.'});
    router.navigate(['/login']);
    return false;
  }
}
