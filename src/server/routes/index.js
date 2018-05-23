const express = require('express');
const pg = require('pg').native;

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
