var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var assert = require('assert');
var mongoUtil = require('./common/mongoUtil');

mongoUtil.connectDB("mongodb://172.17.0.2:27017/NodeJSWebApp", 
  function(err) {
    if(err)  
    {
      console.error("Unable to connect to MongoDB", err);
      throw err
    }
    else 
    {
      console.log("Successfully connected to MongoDB");
    }
  });


var routes = require('./routes/index');
//var users = require('./routes/users');
var comments = require('./routes/comments');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); // Extended true always nested objects in req.body
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/comments', comments);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});
//Make our db accessible to our router
app.use(function(req,res,next) {
  req.db = db;
  next();
})

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    console.log(err.message, err);
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  console.log(err.message, err);
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
