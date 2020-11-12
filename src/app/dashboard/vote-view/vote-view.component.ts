import { Component, OnInit } from '@angular/core';
import { AngularFirestoreDocument } from '@angular/fire/firestore';
import { ActivatedRoute, Router } from '@angular/router';
import { AutoUnsubscribe } from 'src/app/core/decorators/auto-unsubscribe';
import { Election, Vote, VotedUser } from 'src/app/core/models/election.model';
import { ElectionService } from 'src/app/core/services/election-service/election.service';
import { NotificationsService } from 'src/app/core/services/notifications/notification.service';
import { AppSpinnerService } from 'src/app/core/services/spinner-service/spinner.service';

@Component({
  selector: 'app-vote-view',
  templateUrl: './vote-view.component.html',
  styleUrls: ['./vote-view.component.scss']
})
@AutoUnsubscribe()
export class VoteViewComponent implements OnInit {

  election: Election;
  selectedCandidate: any;
  votedUserRef: AngularFirestoreDocument<VotedUser>;

  constructor(
    private route: ActivatedRoute,
    private electionService: ElectionService,
    private notification: NotificationsService,
    private router: Router,
    private spinner: AppSpinnerService
  ) { }

  ngOnInit(): void {
    this.initData();
  }

  private async initData(): Promise<void> {
    const snapshot = await this.route.snapshot?.data?.election;
    this.election = { id: snapshot.id, ...snapshot.data() } as Election;

    this.votedUserRef = this.electionService.getVotedUserByElection(this.election.id);
  }

  submitVote(): void {
    this.spinner.show();
    Promise.all([
      this.electionService.submitVotedUser(this.votedUserRef, new VotedUser()),
      this.electionService.submitUserVote(this.election.id, new Vote(this.selectedCandidate))
    ]).then(() => {
      this.notification.success('Your vote has been recorded!');
      this.router.navigate([`/dashboard/elections/results/${this.election.id}`]);
    })
    .catch((err) => this.notification.error('Something went wrong.', err))
    .finally(() => this.spinner.hide());
  }


}
