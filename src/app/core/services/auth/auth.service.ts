import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

// import * as firebase from 'firebase/app';
// import { auth } from 'firebase/app';
// import { firebase } from '@firebase/app';
import firebase from 'firebase/app';
import 'firebase/auth';

import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';

import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { User } from '../../models/user.model';
import { NotificationsService } from '../notifications/notification.service';
import { DbTable, FirebaseError } from '../../models/firebase.model';

@Injectable({ providedIn: 'root' })
export class AuthService {

  user$: Observable<User>;
  currentUser: User;

  constructor(
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private router: Router,
    private notification: NotificationsService
  ) {
    this.initAuthorizedUser();
    this.user$.subscribe(user => this.currentUser = user);
  }

  getAuthenticatedUser(): User {
    return this.currentUser;
  }

  private initAuthorizedUser(): void {
    this.user$ = this.afAuth.authState
      .pipe(
        switchMap(user => {
          return (user)
            ? this.afs.doc<User>(`${DbTable.Users}/${user.uid}`).valueChanges()
            : of(null);
        })
      );
  }

  public async emailPasswordRegister({ email, password, displayName }): Promise<AngularFirestoreDocument<User>> {
    try {
      const credential = await this.afAuth.createUserWithEmailAndPassword(email, password);
      return this.updateUserData({ ...credential.user, displayName });
    } catch (error) {
      return await this.handleFirebaseAuthError(error);
    }
  }

  public async emailPasswordSignIn({ email, password }): Promise<AngularFirestoreDocument<User>> {
    try {
      const credential = await this.afAuth.signInWithEmailAndPassword(email, password);
      return this.updateUserData(credential.user);
    } catch (error) {
      return await this.handleFirebaseAuthError(error);
    }
  }

  async googleSignin(): Promise<AngularFirestoreDocument<User>> {
    try {
      const provider = new firebase.auth.GoogleAuthProvider();
      const credential = await this.afAuth.signInWithPopup(provider);
      return this.updateUserData(credential.user);
    } catch (error) {
      return await this.handleFirebaseAuthError(error);
    }
  }

  async signOut(): Promise<void> {
    try {
      await this.afAuth.signOut();
    } catch (error) {
      console.error('Log out error ', error);
    }
    this.router.navigate(['/login']);
  }

  private async updateUserData(user: User|any): Promise<AngularFirestoreDocument<User>> {
    const userRef: AngularFirestoreDocument<User> = this.afs.doc(`${DbTable.Users}/${user.uid}`);
    const { uid, email, displayName, photoURL, roles } = user;
    const data = {
      uid, email, photoURL,
      roles: {
        ...roles,
        voter: true,
      }
    } as User;
    if (displayName) {
      data.displayName = displayName;
    }
    await userRef.set(data, { merge: true });
    return userRef;
  }

  private handleFirebaseAuthError(error: any): any {
    const errorCode = error.code;
    if (errorCode === FirebaseError.WRONGPASSWORD) {
      this.notification.error(errorCode);
    } else if (errorCode === FirebaseError.USERNOTFOUND) {
      this.notification.error(errorCode);
    } else if (errorCode === FirebaseError.INVALIDAPIKEY) {
    } else {
      this.notification.error(error.message);
    }
    // this.error.handleError(error);
    return Promise.resolve(error);
  }


  // Role-based Authorization

  canRead(user: User): boolean {
    const allowed = ['admin', 'voter'];
    return this.checkAuthorizationByRole(user, allowed);
  }

  canEdit(user: User): boolean {
    const allowed = ['admin'];
    return this.checkAuthorizationByRole(user, allowed);
  }

  canDelete(user: User): boolean {
    const allowed = ['admin'];
    return this.checkAuthorizationByRole(user, allowed);
  }

  isAdmin(user?: User): boolean {
    return this.checkAuthorizationByRole(!!user ? user : this.currentUser, ['admin']);
  }

  private checkAuthorizationByRole(user: User, allowedRoles: string[]): boolean {
    if (!user) { return false; }
    const roleAllowed = allowedRoles.some(role => !!user.roles[role]);
    return roleAllowed;
  }

}
