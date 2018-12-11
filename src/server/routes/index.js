const express = require('express');
const pg = require('pg').native;
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

const createToken = (email, joined, id) => jwt.sign({
  email,
  joined,
  id,
  exp: Math.floor(Date.now() / 1000) + (60 * 60),
}, process.env.JWT_SECRET);

api.use(async (req, res, next) => {
  await isConnected();
  next();
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

  if (!user) return res.sendStatus(300);

  const correctPass = await bcrypt.compare(pass, user.pass);
  if (correctPass) {
    delete user.pass;
    console.log(user.user_id);
    const token = createToken(user.email, user.joined, user.user_id);
    res.json(token);
  } else {
    res.sendStatus(401);
  }
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
    const joined = new Date();
    await client.query({
      name: 'create-user',
      text: 'insert into "user"("email", "pass", "joined") values($1, $2, $3)',
      values: [email, saltedPass, joined],
    });
    const { rows: [user] } = await client.query({
      name: 'get-id',
      text: 'select * from "user" where "email" = $1',
      values: [email],
    });
    const token = createToken(email, joined, user.user_id);
    res.status(200).json(token);
  } catch (err) {
    res.sendStatus(500);
  }
  return 0;
});

// extend to check url regex and sanitise for storage
const validStory = body => body && 'title' in body && 'url' in body;

api.post('/story', async (req, res) => {
  if (!validStory(req.body)) return res.sendStatus(400);
  if (!req.headers.token) return res.sendStatus(401);
  const { title, url } = req.body;
  try {
    const payload = jwt.verify(req.headers.token, process.env.JWT_SECRET);
    console.log(payload.email);
    const { rows: [user] } = await client.query({
      name: 'check-exists',
      text: 'select * from "user" where "email" = $1',
      values: [payload.email],
    });
    console.log('found user:', user);
    if (!user || (user.user_id !== payload.id)) return res.sendStatus(401);
    const values = [url, title, payload.id];
    console.log('attepmting to insert:', values);
    await client.query({
      name: 'add-story',
      text: 'insert into "post"("text", "title", "user_id") values($1, $2, $3)',
      values,
    });
    // do some storing stuff here
    console.log({ title, url });
    res.sendStatus(200);
  } catch (err) {
    console.log('o no');
    res.status(401).send(err);
  }
});

api.get('/stories', async (req, res) => {
  const { rows } = await client.query({
    name: 'get-stories',
    text: 'select * from "post" limit 25',
  });
  console.log(rows);
  res.json(rows);
});

module.exports = api;
