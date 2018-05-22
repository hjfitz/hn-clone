/**
 * Create an express router and serve the api under that
 * Pulling in extra routes can be done as follows:
 *
 * @example
 *  const contentfulApi = require('./contentful');
 *  api.use('/contentful', contentfulApi);
 * --------
 *
 * The above assumes that contentfulApi is another express route
 * This can be hit with a GET on /api/contentful/{your routes}
 */
const express = require('express');

const api = express.Router();

api.get('/', (req, res) => {
  res.send('Welcome to API 1.0!');
});

// extend to check url regex and sanitise for storage
const validStory = body => body && 'title' in body && 'url' in body;

api.post('/story', (req, res) => {
  if (!validStory(req.body)) {
    res.sendStatus(400);
  }
  const { title, url } = req.body;
  // do some storing stuff here
  console.log(title);
  res.sendStatus(200);
});

module.exports = api;
