import { Injectable } from '@angular/core';
import { User } from '../../models/user.model';

import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { AngularFireFunctions } from '@angular/fire/functions';

import { AuthService } from '../auth/auth.service';
import { DbTable } from '../../models/firebase.model';
import { Election } from '../../models/election.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminElectionService {

  user: User;

  constructor(
    private auth: AuthService,
    private afs: AngularFirestore,
    private fns: AngularFireFunctions
  ) {
    this.user = this.auth.getAuthenticatedUser();
    this.auth.user$.subscribe((user: User) => this.user = user);
  }

  getElections(): AngularFirestoreCollection<Election> {
    return this.afs.collection(DbTable.Elections);
    // , ref => ref.where('status', '==', ElectionStatus.OPEN));
  }

  getElection(id: string): AngularFirestoreDocument<Election> {
    return this.afs.collection(DbTable.Elections).doc(id);
  }

  createElection(data: Election): Promise<string> {
    return this.afs.collection(DbTable.Elections).add(this.toFirebaseElectionConverter(data))
      .then(docRef => docRef.id);
  }

  updateElection(id: string, data: Election): Promise<void> {
    return this.afs.doc(`${DbTable.Elections}/${id}`).set(this.toFirebaseElectionConverter(data), { merge: true });
  }

  updateElectionByRef(ref: AngularFirestoreDocument<Election>, data: Election): Promise<void> {
    return ref.update(data);
  }

  closeAndCountVote(election: Election): Observable<Election> {
    const callable = this.fns.httpsCallable('closeAndCountVote');
    return callable(election);
  }

  // helper functions

  async createOrUpdate(election?: Election): Promise<any> {
    try {
      if (!!election?.id) {
        const { id } = election;
        delete election.id;
        return await this.updateElection(id, election);
      } else {
        return await this.createElection(election);
      }
    } catch (error) {
      return this.handleFirebaseError(error);
    }
  }

  toFirebaseElectionConverter(election: Election): any {
    return {
      title: election?.title,
      titleUppercase: election?.titleUppercase || election.title.toUpperCase(),
      startDate: election?.startDate,
      endDate: election?.endDate,
      status: election?.status,
      candidates: election?.candidates,
      preliminaryResults: election?.preliminaryResults || {},
      finalResults: election?.finalResults || {},
      winner: election?.winner || []
    };
  }

  private handleFirebaseError(error: any): Promise<any> {
    console.error('[ Admin Election Service ] error ->', error);
    return Promise.reject(error);
  }

}
