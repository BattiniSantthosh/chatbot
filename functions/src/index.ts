const functions = require('firebase-functions');
const cors = require('cors')({ origin: true });
const admin = require('firebase-admin');
const serviceAccount = require('../service-acount.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://fireship-lessons-49c42.firebaseio.com',
});

const dialogflow = require('dialogflow');
exports.dialogflowGateway = functions.https.onRequest(
  (request: any, responce: any) => {
    cors(request, responce, async () => {
      const { queryInput, sessionId } = request.body;
      // const client = new dialogflow.v2.SessionsClient({
      //   // optional auth parameters.
      // });
      // const sessionsClient = new SessionsClient({ credential: serviceAccount });
      // const session = sessionsClient.sessionPath({
      //   'fireship-lessons': sessionId,
      // });
      const sessionsClient = new dialogflow.v2.SessionsClient({
        credential: serviceAccount,
      });
      const session = sessionsClient.sessionPath('fireship-lessons', sessionId);
      sessionsClient
        .detectIntent({
          session,
          queryInput,
        })
        .then((responses: any) => {
          const result = responses[0].queryResult;
          responce.send({ result });
        })
        .catch((err: any) => {
          responce.send({ err });
        });
    });
  }
);

// import * as functions from 'firebase-functions';

// const { WebhookClient } = require('dialogflow-fulfillment');

// exports.dialogflowWebhook = functions.https.onRequest(async (request, response) => {
//     const agent = new WebhookClient({ request, response });

//     const result = request.body.queryResult;

//     async function userOnboardingHandler(agent) {

//      // Do backend stuff here
//      const db = admin.firestore();
//      const profile = db.collection('users').doc('jeffd23');

//      const { name, color } = result.parameters;

//       await profile.set({ name, color })
//       agent.add(`Welcome aboard my friend!`);
//     }

//     let intentMap = new Map();
//     intentMap.set('UserOnboarding', userOnboardingHandler);
//     agent.handleRequest(intentMap);
// });
