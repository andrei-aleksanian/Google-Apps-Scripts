const express = require('express');
const router = express.Router();
const {google} = require('googleapis');
const debug = require('debug')('app:formAPI');
const googleAuth = require('./utils/googleAPI');

/* GET users listing. */
router.post('/', async function(req, res, next) {
  debug('posted');
  await googleAuth( {id: 'PASTE YOUR ID HERE', name: 'createTemplateForm'});
  res.send('Google form created');
});

module.exports = router;
