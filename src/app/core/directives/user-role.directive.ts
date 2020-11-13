import { Directive, Input, OnInit } from '@angular/core';
import { TemplateRef, ViewContainerRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { AutoUnsubscribe } from '../decorators/auto-unsubscribe';
import { User } from '../models/user.model';
import { AuthService } from '../services/auth/auth.service';


@Directive({
  selector: '[showIfUser]'
})
@AutoUnsubscribe([])
export class ShowIfUserDirective implements OnInit {

  @Input() showIfUser;

  roleSub = new Subscription();

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private auth: AuthService
  ) { }

  ngOnInit(): void {
    this.roleSub = this.auth.user$.subscribe((user: User) => {
      const roles = user?.roles;
      this.viewContainer.clear();
      if (!!roles && roles[this.showIfUser]) {
        if (this.showIfUser) {
          this.viewContainer.createEmbeddedView(this.templateRef);
        } else {
          this.viewContainer.clear();
        }
      } else {
        if (!this.showIfUser && !roles[`voter`] && !roles[`admin`]) {
          this.viewContainer.createEmbeddedView(this.templateRef);
        } else {
          this.viewContainer.clear();
        }
      }
    });
  }

}
