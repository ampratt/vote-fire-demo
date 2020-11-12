import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardViewComponent } from './dashboard-view/dashboard-view.component';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { MenubarModule } from 'primeng/menubar';
import { CoreModule } from '../core/core.module';
import { DashboardHomeComponent } from './dashboard-home/dashboard-home.component';
import { VoteViewComponent } from './vote-view/vote-view.component';
import { ResultsViewComponent } from './results-view/results-view.component';

@NgModule({
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  declarations: [
    DashboardViewComponent,
    DashboardHomeComponent,
    VoteViewComponent,
    ResultsViewComponent,
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    CoreModule,

    MenubarModule
  ]
})
export class DashboardModule { }
