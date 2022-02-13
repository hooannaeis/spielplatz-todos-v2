const functions = require('firebase-functions');
const vision = require("@google-cloud/vision");
const admin = require('firebase-admin');
admin.initializeApp();

// const keyfile = require("./../../gcloudCredentials.json")

// const config = {
//   projectId: keyfile.project_id,
//   keyFilename: "./gcloudCredentials.json"
// };


// This will allow only requests with an auth token to access the Vision
// API, including anonymous ones.
// It is highly recommended to limit access only to signed-in users. This may
// be done by adding the following condition to the if statement:
//    || context.auth.token?.firebase?.sign_in_provider === 'anonymous'
// 
// For more fine-grained control, you may add additional failure checks, ie:
//    || context.auth.token?.firebase?.email_verified === false
// Also see: https://firebase.google.com/docs/auth/admin/custom-claims
exports.main = functions.runWith({
  // Ensure the function has enough memory and time
  // to process large files
  timeoutSeconds: 300,
  memory: "1GB",
}).https.onRequest(async (req, res) => {
  const client = new vision.ImageAnnotatorClient();

  // if (!context.auth) {
  //   throw new functions.https.HttpsError(
  //     "unauthenticated",
  //     "annotateImage must be called while authenticated."
  //   );
  // }
  console.log(req.query)
  try {
    const filePath = decodeURI(req.query.filePath)

    const request = {
      image: { source: { imageUri: filePath } },
      features: [{ type: "TEXT_DETECTION" }]
    };
    const [result] = await client.textDetection(filePath);
    const detections = result.textAnnotations;
    detections.forEach(text => console.log(text));
    return detections
  } catch (e) {
    throw new functions.https.HttpsError("internal", e.message, e.details);
  }
});

