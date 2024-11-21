import * as functions from 'firebase-functions';

export const someFunction = functions.https.onCall((_data, _context) => {
  // Your function implementation
  return { message: "Success" };
});
