export enum FirebaseError {
    WRONGPASSWORD = 'auth/wrong-password',
    USERNOTFOUND = 'auth/user-not-found',
    INVALIDAPIKEY = 'auth/invalid-api-key'
}

export class DbTable {
    static readonly Users = 'users';
    static readonly Elections = 'elections';
    static readonly Votes = 'votes';
    static readonly VotedUsers = 'votedUsers';
}
