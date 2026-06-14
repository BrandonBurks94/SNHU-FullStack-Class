const express = require('express');
const path = require('path');

require('./app_api/models/db');

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
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');

  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }

  return next();
});

app.get('/travel.html', (req, res) => {
  res.redirect(301, '/travel');
});

app.use(express.static(path.join(__dirname, 'public')));

app.use('/travel', travelRouter);
app.use('/api', apiRouter);
app.use('/API', apiRouter);

module.exports = app;
