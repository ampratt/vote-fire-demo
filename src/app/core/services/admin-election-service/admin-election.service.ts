import { Injectable } from '@angular/core';
import { User } from '../../models/user.model';

import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument, DocumentReference } from '@angular/fire/firestore';
import { AngularFireFunctions } from '@angular/fire/functions';

import { AuthService } from '../auth/auth.service';
import { DbTable } from '../../models/firebase.model';
import { Election, ElectionStatus } from '../../models/election.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminElectionService {

  user: User;

  // categoryListRef: AngularFirestoreCollection<Category> = null;

  constructor(
    private auth: AuthService,
    private afs: AngularFirestore,
    private fns: AngularFireFunctions
  ) {
    this.user = this.auth.getAuthenticatedUser();
    this.auth.user$.subscribe((user: User) => this.user = user);
  }

  // ARTICLES

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


  // Votes

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
