import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AutoUnsubscribe } from 'src/app/core/decorators/auto-unsubscribe';
import { Election, Vote, VotedUser } from 'src/app/core/models/election.model';
import { ElectionService } from 'src/app/core/services/election-service/election.service';

@Component({
  selector: 'app-results-view',
  templateUrl: './results-view.component.html',
  styleUrls: ['./results-view.component.scss']
})
@AutoUnsubscribe()
export class ResultsViewComponent implements OnInit {

  election$: Observable<Election>;
  votedUser$: Observable<VotedUser>;
  voteCounts: any = undefined;

  private unsubscribe$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private electionService: ElectionService
  ) { }

  ngOnInit(): void {
    this.initData();
  }

  private initData(): void {
    const electionId = this.route.snapshot.paramMap.get('id');
    this.election$ = this.electionService.getElection(electionId).valueChanges();

    this.votedUser$ = this.electionService.getVotedUserByElection(electionId).valueChanges();

    this.electionService.getVotesByElection(electionId)
      .valueChanges({ idField: 'id' })
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((votes: Vote[]) => {
        this.voteCounts = votes.reduce((acc, curr) => {
          if (!acc[curr.nominee]) {
            acc[curr.nominee] = 1;
          } else {
            acc[curr.nominee] += 1;
          }
          return acc;
        }, {});
      });
  }

}
