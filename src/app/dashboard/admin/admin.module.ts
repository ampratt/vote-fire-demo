import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateComponent } from './create/create.component';
import { CoreModule } from 'src/app/core/core.module';
import { AdminRoutingModule } from './admin-routing.module';



@NgModule({
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  declarations: [
    CreateComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    CoreModule,
  ]
})
export class AdminModule { }
