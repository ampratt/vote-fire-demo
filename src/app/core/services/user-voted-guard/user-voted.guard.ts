import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, take, tap } from 'rxjs/operators';
import { ElectionService } from '../election-service/election.service';
import { NotificationsService } from '../notifications/notification.service';

@Injectable({
  providedIn: 'root'
})
export class UserVotedGuard implements CanActivate {

  constructor(
    private electionService: ElectionService,
    private router: Router,
    private notification: NotificationsService
  ) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> {

    const electionId: any = route.params.id;

    return this.electionService.getVotedUserByElection(electionId)
      .get()
      .pipe(
        take(1),
        tap((snapshot) => {
          if (!snapshot.data()) {
            console.error('Access denied - you cannot view results till you have voted');
            this.notification.warn('Access denied - you cannot view results till you have voted');
            this.router.navigate(['/dashboard']);
          }
        }),
        map((snapshot) => !!snapshot.data())
      );

  }
}
