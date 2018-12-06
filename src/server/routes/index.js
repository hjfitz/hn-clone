const express = require('express');
const pg = require('pg');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

console.log('attempting to connect to', process.env.DATABASE_URL);
const client = new pg.Client(process.env.DATABASE_URL);

let dbConnected = false;
async function isConnected() {
  if (dbConnected) return;
  await client.connect();
  dbConnected = true;
}

function isEmail(email) {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

const api = express.Router();

api.get('/', (req, res) => {
  res.send('Welcome to API 1.0!');
});

api.post('/login', async (req, res) => {
  const { email, pass } = req.body;
  if (!email) return res.status(400).json({ status: 'err', message: 'no email' });
  if (!pass) return res.status(400).json({ status: 'err', message: 'no password' });
  if (!isEmail(email)) return res.status(400).json({ status: 'err', message: 'invalid email' });
  await isConnected();


  const { rows: [user] } = await client.query({
    name: 'login',
    text: 'select * from "user" where "email" = $1',
    values: [email],
  });

  if (!user) res.sendStatus(300);

  const correctPass = await bcrypt.compare(pass, user.pass);
  if (correctPass) {
    delete user.pass;
    const token = jwt.sign({
      email: user.email,
      joined: user.joined,
      exp: Math.floor(Date.now() / 1000) + (60 * 60),
    }, process.env.JWT_SECRET);
    res.json(token);
  } else {
    res.sendStatus(401);
  }
  // create a jwt and sign here
});

api.post('/signup', async (req, res) => {
  const { email, pass } = req.body;
  if (!email) return res.status(400).json({ status: 'err', message: 'no email' });
  if (!pass) return res.status(400).json({ status: 'err', message: 'no password' });
  if (!isEmail(email)) return res.status(400).json({ status: 'err', message: 'invalid email' });
  await isConnected();


  const { rows: { length: exists } } = await client.query({
    name: 'check-exists',
    text: 'select * from "user" where "email" = $1 limit 1',
    values: [email],
  });

  console.log(exists);

  if (exists) return res.status(400).json({ status: 'err', message: 'user exists' });
  const saltedPass = await bcrypt.hash(pass, 10);

  try {
    await client.query({
      name: 'create-user',
      text: 'insert into "user"("email", "pass", "joined") values($1, $2, $3)',
      values: [email, saltedPass, new Date()],
    });
    res.status(200).json({ status: 'success', message: 'user created' });
  } catch (err) {
    res.sendStatus(500);
  }
  return 0;
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
