import { Component } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { User } from '../../models/user.model';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-account-dropdown',
  templateUrl: './account-dropdown.component.html',
  styleUrls: ['./account-dropdown.component.scss']
})
export class AccountDropdownComponent {

  items: MenuItem[];
  user: User;

  private unsubscribe$ = new Subject<void>();

  constructor(
    public auth: AuthService,
  ) {
    this.auth.user$.pipe(take(1)).subscribe(user => {
      this.user = user;
      this.initMenu();
    });
  }

  initMenu(): void {
    this.items = [
      {
        label: this.user?.displayName,
        items: [
          {
            label: this.user?.email,
            disabled: true
          }]
      },
      {
        separator: true
      },
      {
        label: '',
        items: [
          {
            label: 'Sign out',
            icon: 'pi pi-fw pi-sign-out',
            command: () => this.auth.signOut()
          }
        ]
      }
    ];
  }

}
