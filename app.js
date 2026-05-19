const express = require('express');
const path = require('path');

const travelRouter = require('./app_server/routes/travel');

const app = express();

app.set('views', path.join(__dirname, 'app_server', 'views'));
app.set('view engine', 'hbs');

app.use(express.static(path.join(__dirname, 'public')));

app.use('/travel', travelRouter);

module.exports = app;
