const functions = require("firebase-functions");
const { BigQuery } = require("@google-cloud/bigquery");

function getLabelRegex(rawLabels) {
  // if we didnt get any labels we want to have a regex that catches everything
  if (!rawLabels || !rawLabels.length) {
    return ".*"
  }
  const caseInsensitiveFlag = "(?i)";
  return caseInsensitiveFlag + rawLabels.join("|")
}

function addMissingLabels(orderedLabels, allLabels) {
  if (!allLabels || !allLabels.length > 0) return orderedLabels;

  const completeLabels = orderedLabels;
  for (let i = 0; i < allLabels.length; i++) {
    const label = allLabels[i];
    if (completeLabels.indexOf(label) < 0) {
      completeLabels.push(label)
    }
  }
  return completeLabels;
}

exports.main = functions.https.onCall(async (data, context) => {
  console.log("data: ", data)

  // Checking that the user is authenticated.
  if (!context.auth) {
    // Throwing an HttpsError so that the client gets the error details.
    throw new functions.https.HttpsError('failed-precondition', 'The function must be called while authenticated.');
  }

  const labels = data.labels
  let listID = data.listID

  // if we are in debug, we want to make use of a 
  // production listID that acutally has data to work on
  if (context?.rawRequest?._readableState?.headers?.host.includes("localhost")) {
    listID = "/todo-lists/ybDb2kPUB8t5hJYSWTry"
  }

  if (!listID) {
    throw new functions.https.HttpsError('missing-argument', 'The function must be called with a listID parameter');
  }

  const bigquery = new BigQuery();

  async function getLabelOrderFromBiquery() {
    const query = `WITH
    base AS (
    SELECT
      (
      SELECT
        value.string_value
      FROM
        UNNEST(event_params)
      WHERE
        key = "firesotre_collection") AS firesotre_collection,
      (
      SELECT
        value.string_value
      FROM
        UNNEST(event_params)
      WHERE
        key = "label") AS label,
      (
      SELECT
        value.int_value
      FROM
        UNNEST(event_params)
      WHERE
        key = "ga_session_id") AS session_id,
      event_timestamp,
      event_bundle_sequence_id
    FROM
      \`spielplatz-todo.analytics_303329194.events_*\`
    WHERE
      event_name = "change"
      AND _TABLE_SUFFIX >= "20220501"
      AND (
      SELECT
        value.string_value
      FROM
        UNNEST(event_params)
      WHERE
        key = "type") = "todo"
      AND (
      SELECT
        value.string_value
      FROM
        UNNEST(event_params)
      WHERE
        key = "done") = "true" ),
    ranking AS (
    SELECT
      firesotre_collection,
      label,
      session_id,
      event_timestamp,
      RANK() OVER (PARTITION BY firesotre_collection, session_id ORDER BY base.event_timestamp ASC, event_bundle_sequence_id ASC) AS done_order
    FROM
      base)
  SELECT
    firesotre_collection,
    label,
    AVG(done_order) AS avg_done_order
  FROM
    ranking
    where firesotre_collection = "${decodeURIComponent(listID)}"
    and regexp_contains(label, "${getLabelRegex(labels)}")
  GROUP BY
    firesotre_collection,
    label
  ORDER BY
    avg_done_order asc, label asc`;

    // For all options, see https://cloud.google.com/bigquery/docs/reference/rest/v2/jobs/query
    const options = {
      query: query,
      // Location must match that of the dataset(s) referenced in the query.
      location: 'EU',
    };

    // Run the query as a job
    const [job] = await bigquery.createQueryJob(options);
    console.log(`Job ${job.id} started.`);

    // Wait for the query to finish
    const [rows] = await job.getQueryResults();

    const labelOrder = [];
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      labelOrder.push(row?.label)
    }
    console.log("labelOrder: ", labelOrder)
    return labelOrder;
  }

  const rawLabelOrder = await getLabelOrderFromBiquery();
  const labelOrder = addMissingLabels(rawLabelOrder, labels);
  return { labelOrder }
});