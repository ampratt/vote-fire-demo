// import * as functions from 'firebase-functions';
import * as votePreliminaryResults from './votePreliminaryResults';
import * as callableCloseAndCountVote from './callableCloseAndCountVote';

exports.aggregatePreliminaryResult = votePreliminaryResults.aggregatePreliminaryResult;
exports.closeAndCountVote = callableCloseAndCountVote.closeAndCountVote;


// Start writing Firebase Functions
// https://firebase.google.com/docs/functions/typescript

// export const helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info('Hello logs!', {structuredData: true});
//   response.send('Hello from Firebase!');
// });
