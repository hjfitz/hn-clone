/**
 * imports
 */
const express = require('express');
const helmet = require('helmet');
const compression = require('compression');
const logger = require('morgan');
const path = require('path');
const bodyParser = require('body-parser');
const api = require('./src/server/routes');

/**
 * constants
 */
const app = express();
const pub = path.join(__dirname, 'public');
const index = path.join(pub, 'index.html');

/**
 * middleware setup
 */
app.use(helmet());
app.use(compression());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use('/api', api);

app.use('/public', express.static(path.join(pub, 'assets')));


// this middleware needs to go last
app.use('*', (req, res) => res.sendFile(index));

module.exports = app;
