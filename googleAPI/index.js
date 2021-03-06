// const fs = require('fs');
// const readline = require('readline');
// const {google} = require('googleapis');
//
// // If modifying these scopes, delete token.json.
// const SCOPES = [
//   'https://www.googleapis.com/auth/script.external_request',
//   'https://www.googleapis.com/auth/forms'
// ];
// // The file token.json stores the user's access and refresh tokens, and is
// // created automatically when the authorization flow completes for the first
// // time.
// const TOKEN_PATH = 'token.json';
//
// // Load client secrets from a local file.
// fs.readFile('credentials.json', (err, content) => {
//   if (err) return console.log('Error loading client secret file:', err);
//   // Authorize a client with credentials, then call the Google Drive API.
//   authorize(JSON.parse(content), callAppsScript);
// });
//
// /**
//  * Create an OAuth2 client with the given credentials, and then execute the
//  * given callback function.
//  * @param {Object} credentials The authorization client credentials.
//  * @param {function} callback The callback to call with the authorized client.
//  */
// function authorize(credentials, callback) {
//   const {client_secret, client_id, redirect_uris} = credentials.installed;
//   const oAuth2Client = new google.auth.OAuth2(
//     client_id, client_secret, redirect_uris[0]);
//
//   // Check if we have previously stored a token.
//   fs.readFile(TOKEN_PATH, (err, token) => {
//     if (err) return getAccessToken(oAuth2Client, callback);
//     oAuth2Client.setCredentials(JSON.parse(token));
//     callback(oAuth2Client);
//   });
// }
//
// /**
//  * Get and store new token after prompting for user authorization, and then
//  * execute the given callback with the authorized OAuth2 client.
//  * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
//  * @param {getEventsCallback} callback The callback for the authorized client.
//  */
// function getAccessToken(oAuth2Client, callback) {
//   const authUrl = oAuth2Client.generateAuthUrl({
//     access_type: 'offline',
//     scope: SCOPES,
//   });
//   console.log('Authorize this app by visiting this url:', authUrl);
//   const rl = readline.createInterface({
//     input: process.stdin,
//     output: process.stdout,
//   });
//   rl.question('Enter the code from that page here: ', (code) => {
//     rl.close();
//     oAuth2Client.getToken(code, (err, token) => {
//       if (err) return console.error('Error retrieving access token', err);
//       oAuth2Client.setCredentials(token);
//       // Store the token to disk for later program executions
//       fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
//         if (err) return console.error(err);
//         console.log('Token stored to', TOKEN_PATH);
//       });
//       callback(oAuth2Client);
//     });
//   });
// }
//
// /**
//  * Call an Apps Script function to list the folders in the user's root
//  * Drive folder.
//  *
//  * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
//  */
// function callAppsScript(auth) { // eslint-disable-line no-unused-vars
//   const scriptId = 'MDz7yZrTkWJGgcL2dhVZ7E8AulI5zkEYV';
//   const script = google.script('v1');
//
//   // Make the API request. The request object is included here as 'resource'.
//   script.scripts.run({
//     auth: auth,
//     resource: {
//       function: 'myFunction',
//     },
//     scriptId: scriptId,
//   }, function(err, resp) {
//     if (err) {
//       // The API encountered a problem before the script started executing.
//       console.log('The API returned an error: ' + err);
//       return;
//     }
//     if (resp.error) {
//       // The API executed, but the script returned an error.
//
//       // Extract the first (and only) set of error details. The values of this
//       // object are the script's 'errorMessage' and 'errorType', and an array
//       // of stack trace elements.
//       const error = resp.error.details[0];
//       console.log('Script error message: ' + error.errorMessage);
//       console.log('Script error stacktrace:');
//
//       if (error.scriptStackTraceElements) {
//         // There may not be a stacktrace if the script didn't start executing.
//         for (let i = 0; i < error.scriptStackTraceElements.length; i++) {
//           const trace = error.scriptStackTraceElements[i];
//           console.log('\t%s: %s', trace.function, trace.lineNumber);
//         }
//       }
//     } else {
//       // The structure of the result will depend upon what the Apps Script
//       // function returns. Here, the function returns an Apps Script Object
//       // with String keys and values, and so the result is treated as a
//       // Node.js object (folderSet).
//     }
//   });
// }