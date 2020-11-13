# vote-fire-demo
AngularFire demo app with Firestore, Cloud Functions, and Firebase Hosting

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 10.1.7.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).


# Demo Implementation Details


## AUTHORIZATION / ACCESS CONTROL

- auth.service
    - multiple sign-in methods (Firebase Authentication)
        - which update user doc (Cloud Firestore /users)
    - initAuthorizedUser listens to changes on authState and fetches user record to local Observable

- admin.guard
    - checks auth role based authorization against user roles object

- user-role.directive
    - checks roles['targetRole'] in auth.user$ observable

- app-routing.module
    ...canActivate(redirectLoggedInToDashboard)
    ...canActivate(redirectUnauthorizedToLogin)

- dahsboard-routing.module
    canActivate: [UserNotVotedGuard],
    canActivate: [UserVotedGuard],


## FIREBASE CRUD

### FETCH LIST
- elections-list.ts 
    - list observable subscribed in template
        - valueChanges()
        - snapshotChanges()
            - example in: ElectionResolver
        - get()

### CREATE
-admin - create.component
    - createOrUpdate
        - .set() requires ID
        - .add() auto generates ID


## FIRESTORE DB DESIGN

- users' identity should not be linked to vote result. But still only allow each person to vote once
    - elections/{electionId}/votes
    - elections/{electionId}/votedUsers

        - vote-view.components
            this.electionService.submitVotedUser(this.votedUserRef, new VotedUser()),
            this.electionService.submitUserVote(this.election.id, new Vote(this.selectedCandidate))

- charged by reads/writes. design DB accordingly
    - results-view.component
        displays results in 3 ways
            - reading entire list of votes (will get large and expensive, but accurate)
            - aggregate data to election object in cloud function (probably not on every write, but in some cron interval)
            - aggregate final count to election object in cloud function


## FUNCTIONS

- aggregate preliminary results (firestore onWrite trigger)
    - transaction, locking election document

- aggregate final results (https callable)
    - transaction, locking election document
    - elections-list.ts 
        - callable cloud function

