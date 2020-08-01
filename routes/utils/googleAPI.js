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
* 'Web app?'(I used desktop but I think it will need to be web app for production)
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

// If modifying these scopes, delete token.json.
const SCOPES = [
  'https://www.googleapis.com/auth/script.external_request',
  'https://www.googleapis.com/auth/forms'
];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = 'token.json';

const googleAuth = (apiCall) => {
  debug('authenticating');
// Load client secrets from a local file.
  fs.readFile('credentials.json', (err, content) => {
    if (err) return console.log('Error loading client secret file:', err);
    // Authorize a client with credentials, then call the Google Drive API.
    authorize(JSON.parse(content), apiCall);
  });

  /**
   * Create an OAuth2 client with the given credentials, and then execute the
   * given callback function.
   * @param {Object} credentials The authorization client credentials.
   * @param {function} callback The callback to call with the authorized client.
   */
  function authorize(credentials, callback) {
    const {client_secret, client_id, redirect_uris} = credentials.installed;
    const oAuth2Client = new google.auth.OAuth2(
      client_id, client_secret, redirect_uris[0]);

    // Check if we have previously stored a token.
    fs.readFile(TOKEN_PATH, (err, token) => {
      if (err) return getAccessToken(oAuth2Client, callback);
      oAuth2Client.setCredentials(JSON.parse(token));
      callback(oAuth2Client);
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