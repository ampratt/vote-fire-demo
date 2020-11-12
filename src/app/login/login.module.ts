import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginViewComponent } from './login-view/login-view.component';

import { LoginRoutingModule } from './login-routing.module';
import { EmailLoginFormComponent } from './email-login-form/email-login-form.component';
import { EmailSignupFormComponent } from './email-signup-form/email-signup-form.component';
import { CoreModule } from '../core/core.module';

@NgModule({
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  declarations: [
    LoginViewComponent,
    EmailLoginFormComponent,
    EmailSignupFormComponent
  ],
  imports: [
    CommonModule,
    LoginRoutingModule,
    CoreModule,

  ]
})
export class LoginModule { }
