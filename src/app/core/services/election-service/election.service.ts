import { Injectable } from '@angular/core';
import { User } from '../../models/user.model';

import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { AuthService } from '../auth/auth.service';
import { DbTable } from '../../models/firebase.model';
import { Election, ElectionStatus, Vote, VotedUser } from '../../models/election.model';

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

  // ARTICLES

  getElections(): AngularFirestoreCollection<Election> {
    return this.afs.collection(DbTable.Elections);
  }

  getElection(id: string): AngularFirestoreDocument<Election> {
    return this.afs.collection(DbTable.Elections).doc(id);
  }

  // Votes

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

  // createCategory(data: Category): Promise<DocumentReference> {
  //   return this.afs.collection(DbTable.Categories).add(this.toFirebaseCategoryConverter(data));
  //     // .then(docRef => docRef.id);
  // }





  // getArticleUserRating(aId: string): AngularFirestoreDocument<Rating> {
  //   if (!this.user.uid) { return; }
  //   return this.afs.doc(`${DbTable.Elections}/${aId}/${DbTable.Ratings}/${this.user.uid}`);
  // }

  // updateArticleUserRating(aId: string, data: Rating): Promise<void> {
  //   try {
  //     return this.afs.doc(`${DbTable.Elections}/${aId}/${DbTable.Ratings}/${this.user.uid}`)
  //       .set(this.toFirebaseRatingConverter(data), { merge: true });
  //   } catch (error) {
  //     return this.handleFirebaseError(error);
  //   }
  // }

  // getArticleRatings(aId: string): AngularFirestoreCollection<Rating> {
  //   return this.afs.collection(`${DbTable.Elections}/${aId}/${DbTable.Ratings}`);
  // }

  // Nominees

  // getCategoryById(id: string): AngularFirestoreDocument<Category> {
  //   return this.afs.doc(`${DbTable.Categories}/${id}`);
  // }

  // getCategories(): AngularFirestoreCollection<Category> {
  //   this.categoryListRef = this.afs.collection(DbTable.Categories);
  //   return this.categoryListRef;
  // }

  // // filterCategories({ start = '', end = '' }?: { start: string, end: string }): AngularFirestoreCollection<Category> {
  // filterCategories(start?: string, end?: string): AngularFirestoreCollection<Category> {
  //   if (!start || !end) {
  //     this.getCategories();
  //   } else {
  //     this.categoryListRef = this.afs.collection(DbTable.Categories, ref => ref
  //       .where('nameUppercase', '>=', !!start ? start.toUpperCase() : '')
  //       .where('nameUppercase', '<', !!end ? end.toUpperCase() : ''));
  //   }
  //   return this.categoryListRef;
  // }

  // createCategory(data: Category): Promise<DocumentReference> {
  //   return this.afs.collection(DbTable.Categories).add(this.toFirebaseCategoryConverter(data));
  //     // .then(docRef => docRef.id);
  // }

  // updateCategory(id: string, data: Category): Promise<void> {
  //   return this.afs.doc(`${DbTable.Categories}/${id}`).update(this.toFirebaseCategoryConverter(data));
  // }

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
