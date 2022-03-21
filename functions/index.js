// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//

const annotateImage = require('./src/annotateImage');
exports.annotateImage = annotateImage.main;

const convertImageFormat = require('./src/convertImageFormat');
exports.convertImageFormat = convertImageFormat.main;