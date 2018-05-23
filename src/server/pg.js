const pg = require('pg').native;

const client = new pg.Client({
  connectionString: process.env.DATABASE_URL,
});

client.connect().then(console.log);
