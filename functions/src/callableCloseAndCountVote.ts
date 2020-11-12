import * as functions from 'firebase-functions';
import { db } from './admin';
import { Logger } from './helper';

const logger = new Logger();

export const closeAndCountVote = functions.https.onCall(async (data, context) => {

    try {
        await verifyAuth(context);

        const electionRef = db.doc(`elections/${data.id}`);
        let election;

        const votesRef = db.collection(`elections/${data.id}/votes`);

        await db.runTransaction(async (t) => {
            const snapshot = await t.get(electionRef);
            election = { id: data.id, ...snapshot.data() };

            if (!election) {
                logger.warn('Election not found. Terminating.');
                return null;
            }

            const votesSnapshot = await t.get(votesRef);

            closeElection(election);

            countFinalResults(election, votesSnapshot);

            setWinner(election);

            return t.update(electionRef, election);
        });
        logger.info('[ Close And Count Vote ] Transaction success!');
        return election;
    } catch (e) {
        logger.error('[ Close And Count Vote ] Transaction failure: ' + e);
        return null;
    }
});

const verifyAuth = async (context: any) => {
    if (!context.auth) {
        throw new functions.https.HttpsError('failed-precondition', 'The function must be called while authenticated.');
    }

    const callerRef = db.doc(`users/${context.auth.uid}`);
    const snapshot = await callerRef.get();
    const user = snapshot.data();

    if (!user || !user.roles.admin) {
        throw new functions.https.HttpsError('failed-precondition', 'This function can only be called by ADMIN users');
    }
};

const closeElection = (election: any) => {
    election.status = 'closed';
};

const countFinalResults = (election: any, votesSnapshot: any) => {
    const finalResults = {} as any;

    votesSnapshot.forEach((doc: any) => {
        const vote = doc.data();
        if (!finalResults[vote.nominee]) {
            finalResults[vote.nominee] = 1;
        } else {
            finalResults[vote.nominee] += 1;
        }
    });

    election.finalResults = finalResults;
};


const setWinner = (election: any) => {
    const winnerName = Object.keys(election.finalResults)
        .reduce((a, b) => election.finalResults[a] > election.finalResults[b] ? a : b);

    const winners = Object.entries(election.finalResults)
        .filter(([key, val]) => val === election.finalResults[winnerName])
        .map(item => ({ nominee: item[0], votes: item[1] }));

    election.winner = winners;

    if (winners.length > 1) {
        logger.info('tie -> ' + JSON.stringify(winners));
    } else {
        logger.info('WINNER -> ' + JSON.stringify(winners[0]));
    }
};
