const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const bodyParser = require('body-parser');
const errorHandler = require('errorhandler');
const jade = require('jade');
const routes = require('./routes');

const app = express();

// // view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, '../public/images', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../public')));

app.use('/', routes);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  res.json({ error: 'Not Found' });
});

// error handler
app.use(errorHandler({
  log: console.error,
}));

module.exports = app;
