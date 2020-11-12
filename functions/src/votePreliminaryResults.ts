import * as functions from 'firebase-functions';
import { db } from './admin';
import { Logger } from './helper';

const logger = new Logger();

export const aggregatePreliminaryResult = functions.firestore
    .document('elections/{electionId}/votes/{voteId}')
    .onCreate(async (snapshot, context) => {
        try {
            const electionId = context.params.electionId;
            const electionRef = db.doc(`elections/${electionId}`);
            const vote = snapshot.data();

            await db.runTransaction(async (t) => {
                const election = await t.get(electionRef);

                if (!election) {
                    logger.warn('Election does not exist. Terminating.');
                    return null;
                }

                let electionPreliminaryResults = election.data()?.preliminaryResults;

                if (!electionPreliminaryResults) {
                    electionPreliminaryResults = {};
                }

                if (!vote || !vote.nominee) {
                    logger.warn('[ Invalid Vote ] either null or missing Nominee');
                    return null;
                }

                setOrIncreaseNomineeCount(vote, electionPreliminaryResults);

                return t.update(electionRef, { preliminaryResults: { ...electionPreliminaryResults } });
            });
            logger.info('[ Aggregate Preliminary Results ] Transaction success!');
            return;
        } catch (e) {
            logger.error('[ Aggregate Preliminary Results ] Transaction failure: ' + e);
            return null;
        }
    });

const setOrIncreaseNomineeCount = (vote: any, electionPreliminaryResults: any) => {
    if (!electionPreliminaryResults[vote.nominee]) {
        electionPreliminaryResults[vote.nominee] = 1;
      } else {
        electionPreliminaryResults[vote.nominee] += 1;
      }
};
