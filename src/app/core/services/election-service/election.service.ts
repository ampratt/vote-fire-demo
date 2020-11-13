import { Injectable } from '@angular/core';
import { User } from '../../models/user.model';

import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { AuthService } from '../auth/auth.service';
import { DbTable } from '../../models/firebase.model';
import { Election, Vote, VotedUser } from '../../models/election.model';

@Injectable({
  providedIn: 'root'
})
export class ElectionService {

  user: User;

  constructor(
    private auth: AuthService,
    private afs: AngularFirestore,
  ) {
    this.user = this.auth.getAuthenticatedUser();
    this.auth.user$.subscribe((user: User) => this.user = user);
  }

  getElections(): AngularFirestoreCollection<Election> {
    return this.afs.collection(DbTable.Elections);
  }

  getElection(id: string): AngularFirestoreDocument<Election> {
    return this.afs.collection(DbTable.Elections).doc(id);
  }

  getVotesByElection(electionId: string): AngularFirestoreCollection<Vote> {
    if (!this.user) { return; }
    return this.afs.collection(`${DbTable.Elections}/${electionId}/${DbTable.Votes}`);
  }

  getVotedUserByElection(electionId: string): AngularFirestoreDocument<VotedUser> {
    if (!this.user) { return; }
    return this.afs.collection(`${DbTable.Elections}/${electionId}/${DbTable.VotedUsers}`).doc(this.user.uid);
  }

  submitVotedUser(docRef: AngularFirestoreDocument<VotedUser>, data: VotedUser): Promise<void> {
    return docRef.set(this.toFirebaseVotedUserConverter(data));
  }

  submitUserVote(electionId: string, data: Vote): Promise<string> {
    if (!this.user) { return; }
    return this.afs.collection(`${DbTable.Elections}/${electionId}/${DbTable.Votes}`)
      .add(this.toFirebaseVoteConverter(data))
      .then(docRef => docRef.id);
  }

  // helper functions

  toFirebaseVoteConverter(vote: Vote): any {
    return {
      nominee: vote?.nominee,
      insertDate: vote?.insertDate
    };
  }

  toFirebaseVotedUserConverter(votedUser: VotedUser): any {
    return {
      insertDate: votedUser?.insertDate
    };
  }

  private handleFirebaseError(error: any): Promise<any> {
    console.error('[ Admin Election Service ] error ->', error);
    return Promise.reject(error);
  }

}
