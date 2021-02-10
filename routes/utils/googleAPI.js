/*
* This util is needed to access the google API.
* What is required:
* 1. Get a G-suite account
* 2. Log into the G-suite account.
* 3. Make a GCP(Google Cloud Platform) project (you will need to input your domain name)
* 4. Enable 'Apps Script' API in marketplace
* 5. Go to(stay at) the management board
* 6. Choose 'Credentials' > 'Configure Consent Screen' > 'Internal'
* 7. Fill in your details
* 8. Choose 'Credentials' > 'Create Credentials' > 'OAuth client' >
* 'Web app?'(I used desktop, but I think it will need to be web app for production)
* 9. Exit the screen and click the download button on the right for the created OAuth client
* 10. Rename it to 'credentials.json' and keep in the root directory of the project. Do not commit it.
* 11. Open your cloud script that you want to run (go to Apps Scripts, make a project and write a function)
* 12. Choose Resources > Cloud Platform project
* 13. Paste your project number in (can be found on GCP dashboard)
* 14. Once done, choose 'Publish' > 'Deploy as API executable'
* 15. Paste your script id into the scriptId variable in the POST endpoint
* 16. Paste the name of the function into params of 'scripts.run({..., function: *name here*, ... })'
* 17. Make sure you have the correct SCOPES specified. The current ones are for running the scripts on forms only
* 18. Start the server
* 19. Make a POST request to the form endpoint
* 20. On the first request, it will ask you to allow the app to use forms on your account. Allow.
* 21. It will then store a token on your machine. Do not commit it. (Just like credentials.json)
* */

const fs = require('fs');
const readline = require('readline');
const {google} = require('googleapis');
const debug = require('debug')('untitled6:formAPI');
const path = require('path')

// If modifying these scopes, delete token.json.
const SCOPES = [
  'https://www.googleapis.com/auth/script.external_request',
  'https://www.googleapis.com/auth/forms',
  'https://www.googleapis.com/auth/spreadsheets',
];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = 'token.json';

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

const googleAuth = ({id, name}) => {
  debug('authenticating');
// Load client secrets from a local file.
  fs.readFile(path.join(__dirname, 'credentials.json'), (err, content) => {
    if (err) return console.log('Error loading client secret file:', err);
    // Authorize a client with credentials, then call the Google Drive API.
    authorize(JSON.parse(content), callAppsScript, {id, name});
  });

  /**
   * Create an OAuth2 client with the given credentials, and then execute the
   * given callback function.
   * @param {Object} credentials The authorization client credentials.
   * @param {function} callback The callback to call with the authorized client.
   * @param {Object} payload with id and name of executing function
   */
  function authorize(credentials, callback, {id, name}) {
    const {client_secret, client_id, redirect_uris} = credentials.installed;
    const oAuth2Client = new google.auth.OAuth2(
      client_id, client_secret, redirect_uris[0]);

    // Check if we have previously stored a token.
    fs.readFile(TOKEN_PATH, (err, token) => {
      if (err) return getAccessToken(oAuth2Client, callback);
      oAuth2Client.setCredentials(JSON.parse(token));
      callback(oAuth2Client, id, name);
    });
  }

  /**
   * Get and store new token after prompting for user authorization, and then
   * execute the given callback with the authorized OAuth2 client.
   * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
   * @param {getEventsCallback} callback The callback for the authorized client.
   */
  function getAccessToken(oAuth2Client, callback) {
    const authUrl = oAuth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: SCOPES,
    });
    console.log('Authorize this app by visiting this url:', authUrl);
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    rl.question('Enter the code from that page here: ', (code) => {
      rl.close();
      oAuth2Client.getToken(code, (err, token) => {
        if (err) return console.error('Error retrieving access token', err);
        oAuth2Client.setCredentials(token);
        // Store the token to disk for later program executions
        fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
          if (err) return console.error(err);
          console.log('Token stored to', TOKEN_PATH);
        });
        callback(oAuth2Client);
      });
    });
  }
}

module.exports = googleAuth;