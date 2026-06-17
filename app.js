const express = require('express');
const path = require('path');
const passport = require('passport');

require('dotenv').config();
require('./app_api/models/db');
require('./app_api/config/passport');

const travelRouter = require('./app_server/routes/travel');
const apiRouter = require('./app_api/routes');

const app = express();

app.set('views', path.join(__dirname, 'app_server', 'views'));
app.set('view engine', 'hbs');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const allowedOrigins = new Set([
    'http://localhost:4200',
    'http://127.0.0.1:4200'
  ]);
  const origin = req.get('origin');

  if (allowedOrigins.has(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }

  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }

  return next();
});

app.get('/travel.html', (req, res) => {
  res.redirect(301, '/travel');
});

app.use(express.static(path.join(__dirname, 'public')));
app.use(passport.initialize());

app.use('/travel', travelRouter);
app.use('/api', apiRouter);
app.use('/API', apiRouter);

app.use((err, req, res, next) => {
  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({ message: `${err.name}: ${err.message}` });
  }

  return next(err);
});

module.exports = app;
