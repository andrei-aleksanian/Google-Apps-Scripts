# Google Apps Scripts

A working example of how to use Google Apps Scripts from your own Node application.
(The node application itself is just a template from `npx --package express-generator express`)

## Important Files

`routes/utils/makeFormTemplate.gs` - an example of making a Google Apps Script which makes a form

`routes/utils/googleAPI.js` - wrapper functions for Google authentication

`routes/form.js` - POST endpoint which calls a google function by passing the function name and id

## An example of a POST endpoint

`projectNmae/routes/form.js` is the POST endpoint

`routes/utils/googleAPI.js` is the wrapper functions needed to use the google API

### How to get started

1. Get a G-suite account
2. Log into the G-suite account.
3. Make a GCP(Google Cloud Platform) project (you will need to input your domain name)
4. Enable `Apps Script` API in marketplace
5. Go to(stay at) the management board
6. Choose `Credentials > Configure Consent Screen > Internal`
7. Fill in your details
8. Choose `Credentials > Create Credentials > OAuth client >
desktop`(I used `desktop`, but I think it will need to be `web app` for production)
9. Exit the screen and click the download button on the right for the created OAuth client
10. Rename it to `credentials.json` and keep in the root directory of the project. Do not commit it.
11. Open your cloud script that you want to run (`routes/utils/makeFormTemplate.gs` is an example of making a GSS form template`go to Apps Scripts, make a project and write a function)
12. Choose `Resources > Cloud Platform project`
13. Paste your `project number` in (can be found on GCP dashboard)
14. Once done, choose `Publish > Deploy as API executable`
15. Paste your script id into the scriptId variable in the POST endpoint
16. Paste the name of the function into params of `scripts.run({..., function: *name here*, ... })`
17. Make sure you have the correct `SCOPES` specified. The current ones are for running the scripts on forms only
18. Start the server
19. Make a POST request to the form endpoint
20. On the first request, it will ask you to allow the app to use forms on your account. Allow.
21. It will then store a token on your machine. Do not commit it. (Just like credentials.json)
22. You are done!

### Creating more endpoints

To create more endpoints, simply create another script on the 'Google Apps Scripts'.

Follow the steps 11 - 21. 

Don't forget to update the `SCOPES` if you are changing the functionality of the scripts.

If you are changing the `SCOPES`, delete `token.json` before the first request to get new permissions

#### Example

Put:


`  await googleAuth({id: '*functionId*', name: '*functionName*'});`

in the endpoint. If everything is configured correctly, it will execute. 

Leave me a message if something is not working :)