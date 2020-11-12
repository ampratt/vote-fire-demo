import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { LoginViewComponent } from './login/login-view/login-view.component';
import { canActivate, redirectLoggedInTo, redirectUnauthorizedTo } from '@angular/fire/auth-guard';

const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['/login']);
const redirectLoggedInToDashboard = () => redirectLoggedInTo(['/dashboard']);

const routes: Routes = [
  {
    path: 'login',
    component: LoginViewComponent,
    loadChildren: () => import('./login/login-routing.module').then(m => m.LoginRoutingModule),
    ...canActivate(redirectLoggedInToDashboard)
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./dashboard/dashboard-routing.module').then(m => m.DashboardRoutingModule),
    ...canActivate(redirectUnauthorizedToLogin)
  },
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: '/login',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(
      routes,
      {
        preloadingStrategy: PreloadAllModules
      }
    )
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
