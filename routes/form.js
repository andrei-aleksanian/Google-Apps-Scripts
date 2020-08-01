const express = require('express');
const router = express.Router();
const {google} = require('googleapis');
const debug = require('debug')('untitled6:formAPI');
const googleAuth = require('./utils/googleAPI');

/* GET users listing. */
router.post('/', async function(req, res, next) {
  debug('posted');
  await googleAuth( {id: 'MKFBH_NiLg7Jjp3YIPbP1QLU2UhZLtYfG', name: 'createTemplateForm'});
  res.send('Google form created');
});

module.exports = router;
