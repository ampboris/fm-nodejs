const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
// Config
const config = require('./config');
require('./db/mongoose');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cors({
  origin: '*',
  methods: 'PUT, GET, POST, DELETE, OPTIONS',
  exposedHeaders: ['x-auth'],
  preflightContinue: false,
  optionsSuccessStatus: 204
}));

// Set port
const port = process.env.PORT || '8083';
app.set('port', port);

// Set static path to Angular app in dist
// Don't run in dev
if (process.env.NODE_ENV !== 'dev') {
  app.use('/', express.static(path.join(__dirname, './dist')));
}
// Routes
require('./api')(app, config);

// Pass routing to Angular app
// Don't run in dev
if (process.env.NODE_ENV !== 'dev') {
  console.log('Run on Prod');
  // app.get('*', function (req, res) {
  //   res.sendFile(path.join(__dirname, '/static/index.html'));
  // });
}

app.use('/static', express.static(path.join(__dirname, 'public')));

app.listen(port, () => console.log(`Server running on localhost:${port}`));

module.exports = {app};
