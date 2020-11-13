import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { AutoUnsubscribe } from 'src/app/core/decorators/auto-unsubscribe';
import { Election, ElectionStatus } from 'src/app/core/models/election.model';
import { ElectionService } from 'src/app/core/services/election-service/election.service';
import * as moment from 'moment';
import { NotificationsService } from '../../services/notifications/notification.service';
import { AuthService } from '../../services/auth/auth.service';
import { takeUntil } from 'rxjs/operators';
import { User } from '../../models/user.model';
import { AdminElectionService } from '../../services/admin-election-service/admin-election.service';
import { AppSpinnerService } from '../../services/spinner-service/spinner.service';

@Component({
  selector: 'app-elections-list',
  templateUrl: './elections-list.component.html',
  styleUrls: ['./elections-list.component.scss']
})
@AutoUnsubscribe()
export class ElectionsListComponent implements OnInit {

  elections$: Observable<Election[]>;
  user: User;
  ElectionStatus = ElectionStatus;

  private unsubscribe$ = new Subject<void>();

  constructor(
    private auth: AuthService,
    private adminElectionService: AdminElectionService,
    private electionService: ElectionService,
    private router: Router,
    private notification: NotificationsService,
    private spinner: AppSpinnerService
  ) {
    this.auth.user$.pipe(takeUntil(this.unsubscribe$)).subscribe(user => this.user = user);
  }

  ngOnInit(): void {
    this.elections$ = this.electionService.getElections().valueChanges({ idField: 'id' });
  }

  handleVoteClicked(election: Election): void {
    if (this.isAllowedToVote(election)) {
      this.router.navigate([`/dashboard/elections/vote/${election.id}`]);
    }
  }

  handleResultsClicked(election: Election): void {
    this.router.navigate([`/dashboard/elections/results/${election.id}`]);
  }

  handleCloseElectionClicked(election: Election): void {
    if (this.auth.isAdmin(this.user)) {
      this.spinner.show();
      this.adminElectionService.closeAndCountVote(election)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe(
          (electionResult: Election) => {
            if (electionResult?.status === ElectionStatus.CLOSED) {
              this.notification.success(`Election '${electionResult.title}' set to ${electionResult.status}`);
            }
          },
          (err) => this.notification.error('A problem happened closing the election: ', err),
          () => this.spinner.hide());
    }
  }

  private isAllowedToVote(election: Election): boolean {
    const now = moment();
    const start = moment((election.startDate as any).seconds * 1000);
    const end = moment((election.endDate as any).seconds * 1000);
    if (!(now.isAfter(start) && now.isBefore(end))) {
      this.notification.warn('Sorry, voting ended');
      return false;
    }

    if (election.status === ElectionStatus.CLOSED) {
      this.notification.warn('Sorry, voting is closed');
      return false;
    }

    return true;
  }

}
