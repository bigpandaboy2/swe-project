import {Routes} from '@angular/router';
import {LoginComponent} from './core/auth/login/login.component';
import {LoginAdminComponent} from './core/auth/login-admin/login-admin.component';
import {AdminDashboardComponent} from './pages/admin-dashboard/admin-dashboard.component';
import {authGuard} from './shared/guards/auth.guard';
import {FarmerDashboardComponent} from './pages/farmer-dashboard/farmer-dashboard.component';
import {roleGuard} from './shared/guards/role.guard';

export const routes: Routes = [
  {
    path: '', redirectTo: '/login', pathMatch: 'full',
  },
  {
    path: 'login', component: LoginComponent
  },
  {
    path: 'admin-login', component: LoginAdminComponent
  },
  {
    path: 'login-admin', component: LoginAdminComponent
  },
  {
    path: 'admin-dashboard', component: AdminDashboardComponent, canActivate: [authGuard]
  },
  {
    path: 'farmer-dashboard', component: FarmerDashboardComponent, canActivate: [authGuard, roleGuard], data: { expectedRole: 'farmer' }
  },
  {
    path: 'buyer-dashboard', component: FarmerDashboardComponent, canActivate: [authGuard, roleGuard], data: { expectedRole:'buyer' }
  }
];
