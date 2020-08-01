const  express = require('express');
const router = express.Router();
const {google} = require('googleapis');
const debug = require('debug')('untitled6:formAPI');
const googleAuth = require('./utils/googleAPI');

/**
 * Call an Apps Script function to list the folders in the user's root
 * Drive folder.
 *
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 * @param {string} id The id of the Google Apps Script
 * @param {string} name The name of the Google Apps Script function
 */
function callAppsScript(auth, id, name) { // eslint-disable-line no-unused-vars
  const scriptId = id;
  const script = google.script('v1');

  // Make the API request. The request object is included here as 'resource'.
  script.scripts.run({
    auth: auth,
    resource: {
      function: name,
    },
    scriptId: scriptId,
  }, function(err, resp) {
    if (err) {
      // The API encountered a problem before the script started executing.
      console.log('The API returned an error: ' + err);
      return;
    }
    if (resp.error) {
      // The API executed, but the script returned an error.

      // Extract the first (and only) set of error details. The values of this
      // object are the script's 'errorMessage' and 'errorType', and an array
      // of stack trace elements.
      const error = resp.error.details[0];
      console.log('Script error message: ' + error.errorMessage);
      console.log('Script error stacktrace:');

      if (error.scriptStackTraceElements) {
        // There may not be a stacktrace if the script didn't start executing.
        for (let i = 0; i < error.scriptStackTraceElements.length; i++) {
          const trace = error.scriptStackTraceElements[i];
          console.log('\t%s: %s', trace.function, trace.lineNumber);
        }
      }
    } else {
      // The structure of the result will depend upon what the Apps Script
      // function returns. Here, the function returns an Apps Script Object
      // with String keys and values, and so the result is treated as a
      // Node.js object (folderSet).
    }
  });
}

/* GET users listing. */
router.post('/', async function(req, res, next) {
  debug('posted');
  await googleAuth(callAppsScript, {id: 'MKFBH_NiLg7Jjp3YIPbP1QLU2UhZLtYfG', name: 'createTemplateForm'});
  res.send('Google form created');
});

module.exports = router;
