import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AutoUnsubscribe } from 'src/app/core/decorators/auto-unsubscribe';
import { Election } from 'src/app/core/models/election.model';
import { ElectionService } from 'src/app/core/services/election-service/election.service';

@Component({
  selector: 'app-elections-list',
  templateUrl: './elections-list.component.html',
  styleUrls: ['./elections-list.component.scss']
})
@AutoUnsubscribe()
export class ElectionsListComponent implements OnInit {

  elections$: Observable<Election[]>;

  constructor(
    private electionService: ElectionService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.elections$ = this.electionService.getElections().valueChanges({ idField: 'id' });
  }

  handleVoteClicked(id: string): void {
    this.router.navigate([`/dashboard/elections/vote/${id}`]);
  }

  handleResultsClicked(id: string): void {
    this.router.navigate([`/dashboard/elections/results/${id}`]);
  }

  handleCloseElectionClicked(id: string): void {

  }



}
