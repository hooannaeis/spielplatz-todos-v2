const functions = require('firebase-functions');
const vision = require("@google-cloud/vision");
const fetch = require("node-fetch");
const { Base64Encode } = require("base64-stream");

const admin = require('firebase-admin');
admin.initializeApp();

// By default, the client will authenticate using the service account file
// specified by the GOOGLE_APPLICATION_CREDENTIALS environment variable and use
// the project specified by the GCLOUD_PROJECT environment variable. See
// https://cloud.google.com/docs/authentication/getting-started#setting_the_environment_variable

// Instantiate a vision client
const client = new vision.ImageAnnotatorClient();


/**
 * Given a set of image file paths, extract the text and run them through the
 * Cloud Vision API.
 * @param {Index} index The stateful `Index` Object.
 * @param {string[]} inputFiles The list of files to process.
 * @returns {Promise<void>}
 */
async function getTextFromFiles(inputFiles) {
  // Read all of the given files and provide request objects that will be
  // passed to the Cloud Vision API in a batch request.
  const requests = await Promise.all(
    inputFiles.map(async filename => {
      functions.logger.log(` 👉 ${filename}`);
      return {
        image: {
          source: {
            imageUri: filename
          }
        },
        features: [{ type: 'TEXT_DETECTION' }],
      };
    })
  );

  // Make a call to the Vision API to detect text
  const results = await client.batchAnnotateImages({ requests });
  const detections = results[0].responses;
  let fullTextBody = [];
  await Promise.all(
    inputFiles.map(async (filename, i) => {
      const response = detections[i];
      if (response.error) {
        console.info(`API Error for ${filename}`, response.error);
        return;
      }
      const textBody = response.textAnnotations
      fullTextBody.push(textBody)
    })
  );
  return fullTextBody
}


exports.main = functions.runWith({
  // Ensure the function has enough memory and time
  // to process large files
  timeoutSeconds: 300,
  memory: "1GB",
}).firestore.document('/recipes/{documentId}')
  .onCreate(async (snap, context) => {
    // this is what a recipe looks like: 
    // const newRecipe = { name: this.newRecipeName, imageUrls, fullPaths }
    // Grab the current value of what was written to Firestore.
    const recipe = snap.data();

    // Access the parameter `{documentId}` with `context.params`
    functions.logger.log('getting text from images', context.params.documentId, recipe);

    try {
      const fullTextBody = await getTextFromFiles(recipe.imageUrls)
      functions.logger.log(fullTextBody)

      // You must return a Promise when performing asynchronous tasks inside a Functions such as
      // writing to Firestore.
      // Setting an 'uppercase' field in Firestore document returns a Promise.
      return snap.ref.set({ fullTextBody }, { merge: true });
      // [END makeUppercaseBody]
    } catch (e) {
      throw new functions.https.HttpsError("internal", e.message, e.details);
    }
  });
