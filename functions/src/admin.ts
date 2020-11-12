import * as fbAdmin from 'firebase-admin';

fbAdmin.initializeApp();

export const admin = fbAdmin;
export const db = admin.firestore();
