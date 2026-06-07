const express = require('express');
const path = require('path');

require('./app_api/models/db');

const travelRouter = require('./app_server/routes/travel');
const apiRouter = require('./app_api/routes');

const app = express();

app.set('views', path.join(__dirname, 'app_server', 'views'));
app.set('view engine', 'hbs');

app.get('/travel.html', (req, res) => {
  res.redirect(301, '/travel');
});

app.use(express.static(path.join(__dirname, 'public')));

app.use('/travel', travelRouter);
app.use('/api', apiRouter);
app.use('/API', apiRouter);

module.exports = app;
