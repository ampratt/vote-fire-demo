export interface Roles {
    voter?: boolean;
    admin?: boolean;
}

export interface User {
    uid: string;
    email: string;
    displayName?: string;
    photoURL?: string;
    roles: Roles;
}
