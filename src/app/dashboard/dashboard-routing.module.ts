import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminGuard } from '../core/services/admin-guard/admin.guard';
import { ElectionResolver } from '../core/services/election-resolver/election-resolver.service';
import { UserNotVotedGuard } from '../core/services/user-not-voted-guard/user-not-voted.guard';
import { UserVotedGuard } from '../core/services/user-voted-guard/user-voted.guard';
import { DashboardHomeComponent } from './dashboard-home/dashboard-home.component';
import { DashboardViewComponent } from './dashboard-view/dashboard-view.component';
import { ResultsViewComponent } from './results-view/results-view.component';
import { VoteViewComponent } from './vote-view/vote-view.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardViewComponent,
    children: [
      { path: '', redirectTo: 'elections', pathMatch: 'full' },
      { path: 'elections', component: DashboardHomeComponent },
      {
        path: 'elections/vote/:id',
        component: VoteViewComponent,
        canActivate: [UserNotVotedGuard],
        resolve: { election: ElectionResolver }
      },
      {
        path: 'elections/results/:id',
        component: ResultsViewComponent,
        canActivate: [UserVotedGuard],
      },
      {
        path: 'admin',
        loadChildren: () => import('./admin/admin-routing.module').then(m => m.AdminRoutingModule),
        canActivate: [AdminGuard]
      },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
