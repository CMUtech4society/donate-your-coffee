var express = require('express');
require('express-async-errors');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', require('./routes/index'));

app.use((error, req, res, next) => {
  console.log(error);
  res.status(error.status || 500).json({
    error: error,
    message: error.message
  });
});

module.exports = app;
