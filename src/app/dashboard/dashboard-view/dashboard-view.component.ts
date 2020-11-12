import { Component } from '@angular/core';
import { AutoUnsubscribe } from 'src/app/core/decorators/auto-unsubscribe';

@Component({
  selector: 'app-dashboard-view',
  templateUrl: './dashboard-view.component.html',
  styleUrls: ['./dashboard-view.component.scss']
})
@AutoUnsubscribe()
export class DashboardViewComponent  {

  constructor() { }

}
