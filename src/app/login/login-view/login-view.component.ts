import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AutoUnsubscribe } from 'src/app/core/decorators/auto-unsubscribe';
import { AuthService } from 'src/app/core/services/auth/auth.service';

@Component({
  selector: 'app-login-view',
  templateUrl: './login-view.component.html',
  styleUrls: ['./login-view.component.scss']
})
@AutoUnsubscribe([])
export class LoginViewComponent {

  loginFormActive = true;
  sub;

  constructor(
    private router: Router,
    public auth: AuthService
  ) {
    this.sub = this.auth.user$.subscribe((user) => {
      if (!!user) {
        this.router.navigate(['/dashboard']);
      }
    });
  }

}
