import { Injectable } from '@angular/core';
import { Router, Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { of } from 'rxjs';
import { catchError, take, tap } from 'rxjs/operators';
import { Election } from '../../models/election.model';
import { ElectionService } from '../election-service/election.service';

@Injectable({
  providedIn: 'root'
})
export class ElectionResolver implements Resolve<any> {

  constructor(
    private router: Router,
    private electionService: ElectionService
  ) { }

  resolve(route: ActivatedRouteSnapshot): any {
    const id: any = route.params.id;

    return this.electionService.getElection(id)
      .get()
      .pipe(
        take(1),
        tap((snapshot) => {
          if (snapshot) {
            return { id: snapshot.id, ...snapshot.data() } as Election;
          }
        }),
        catchError(error => {
          console.log(`Election Resolver error: ${error}`);
          this.router.navigate(['/dashboard/elections']);
          return of(false);
        })
      );
  }

}
