var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser'); // Middware parses request.body before 
var assert = require('assert');
var passport = require('passport'); // Authentication Framework
var passportLocalStrategy = require('passport-local').Strategy; // Authentication Strategy
const pug = require('pug');
const fs = require('fs');
var mongoUtil = require('./common/mongoUtil'); 
var routes = require('./routes/index');
var comments = require('./routes/comments');

/* Javascript Generators 
1. Compile client pug templates (./views/client/..) to javascript functions as strings.
2. Write Javascript Function Strings to files (./public/javascripts/views/..)
3. Add javascript files to ./views/layout.pug
*/
fs.readdirSync('./public/javascripts/views/').forEach(oldJsFile => {
  fs.unlinkSync('./public/javascripts/views/'+oldJsFile)
});
fs.readdirSync('./views/client/').forEach(pugFilename => {
  var functionName = pugFilename.substring(0, pugFilename.length - 4) + 'HtmlGenerator'
  var jsFilename = functionName + '.js'
  var jsFilepath = './public/javascripts/views/'+jsFilename;
  var jsFunctionString = pug.compileFileClient('./views/client/'+pugFilename, { name: functionName });
  fs.writeFileSync(jsFilepath, jsFunctionString)
});

/* Initialize MongoUtil.
*/
mongoUtil.connectDB("mongodb://172.17.0.2:27017/NodeJSWebApp");

var app = express();
app.set('views', './views');
app.set('view engine', 'pug');
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); // Extended true always nested objects in req.body
app.use(cookieParser());
app.use(express.static('./public'));
app.use(passport.initialize());
app.use(passport.session());
app.use('/', routes);
app.use('/comments', comments);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});
// Error Handler - Dev
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
// Error Handler - Prod
app.use(function(err, req, res, next) {
  console.log(err.message, err);
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;