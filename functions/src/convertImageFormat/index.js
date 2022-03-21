const functions = require('firebase-functions');
const path = require("path");
const { Storage } = require('@google-cloud/storage');
const sharp = require('sharp');

const gcs = new Storage();

exports.main = functions.storage.object().onFinalize(async (object) => {
  const fileBucket = object.bucket; // The Storage bucket that contains the file.
  const filePath = object.name; // File path in the bucket.
  const contentType = object.contentType; // File content type.

  // Exit if this is triggered on a file that is not an image.
  if (!contentType.startsWith('image/')) {
    functions.logger.log('This is not an image.');
    return null;
  }
  // Exit if this is triggered on a file that is already a webp file.
  if (filePath.endsWith(".webp")) {
    functions.logger.log('image is already webp.');
    return null;
  }

  // Get the file name.
  const fileName = path.basename(filePath);
  // Download file from bucket.
  const bucket = gcs.bucket(fileBucket);

  const metadata = {
    contentType: "image/webp",
  };

  const webPFilename = fileName.replace(new RegExp(/\.[a-zA-Z]{2,6}$/), ".webp")
  const webPFilePath = path.join(path.dirname(filePath), webPFilename);
  const webPUploadStream = bucket.file(webPFilePath).createWriteStream({ metadata });
  const pipeline = sharp();
  pipeline.webp().pipe(webPUploadStream);

  bucket.file(filePath).createReadStream().pipe(pipeline);
  return new Promise((resolve, reject) => {
    webPUploadStream.on('finish', resolve).on('error', reject);
  })
});