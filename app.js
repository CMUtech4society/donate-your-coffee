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

var db;
app.use((req, res, next) => { req.db = db; next(); });
app.use('/', require('./routes/index'));

app.use((error, req, res, next) => {
  console.log(error);
  res.status(error.status || 500).json({
    error: error+''
  });
});

module.exports = app;
module.exports.getDb = () => db;
module.exports.setDb = newDb => { db = newDb; };
