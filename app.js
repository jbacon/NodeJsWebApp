var express = require('express');
var session = require('express-session')
var MongoDBStore = require('connect-mongodb-session')(session);
var path = require('path');
var favicon = require('serve-favicon');
var winston = require('winston');
var expressWinston = require('express-winston');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser'); // Middware parses request.body before 
var assert = require('assert');
// Routes
var routesIndex = require('./routes/index');
var routesArticles = require('./routes/articles');
var routesComments = require('./routes/comments');
var routesAuth = require('./routes/auth');
var routesAccounts = require('./routes/accounts');
var routesRoles = require('./routes/roles');
// Commons
var commonMongo = require('./common/mongoUtil'); 
var markdownUtil = require('./common/markdownUtil'); 
var commonAuth = require('./common/authUtil'); 
var commonPug = require('./common/pugUtil'); 

var logger = new (winston.Logger) ( {
  transports: [
    new (winston.transports.Console) ({
      json: true,
      colorize: true,
      level: 'info'
    })
  ]
});
/* Generate Client Javascript Functions that generate reusable HTML components.
Poor man's React.js? I want to avoid integrating a visualization framework at this point, 
this method makes SPA U.I. compoennts simple and easy (via AJAX)
*/
commonPug.compilePugFilesToClientJsFile({
  srcDirPugFiles: './views/client/', 
  destPathJsFile: './public/javascripts/views/pug-functions-auto-generated.js',
  overwriteFile: true,
  suffixForFunctions: 'generatehtmlfor'
});

commonMongo.connectDB("mongodb://172.17.0.2:27017/NodeJSWebApp");

var app = express();
app.set('views', './views');
app.set('view engine', 'pug');
app.use(express.static('./public'));
// Setup Session - MongoDB Store
var sessionStore = new MongoDBStore(
{
  uri: 'mongodb://172.17.0.2:27017/NodeJSWebApp',
  collection: 'sessions'
});
sessionStore.on('error', function(error) {
  assert.ifError(error);
  assert.ok(false);
});
app.use(session({
  secret: 'This is a secret phrase',
  cookie: {
    maxAge: 1000 * 60 * 5 // 5 minutes
  },
  store: sessionStore,
  resave: true,
  saveUninitialized: true
}));
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); // Extended true always nested objects in req.body
app.use(cookieParser());
app.use(commonAuth.getPassport().initialize());
app.use(commonAuth.getPassport().session());

// REQUEST LOGGING - BEFORE the router.
app.use(expressWinston.logger({
  winstonInstance: logger,
  meta: true, // optional: control whether you want to log the meta data about the request (default to true)
  msg: "HTTP {{req.method}} {{req.url}}", // optional: customize the default logging message. E.g. "{{res.statusCode}} {{req.method}} {{res.responseTime}}ms {{req.url}}"
  expressFormat: true, // Use the default Express/morgan request formatting. Enabling this will override any msg if true. Will only output colors with colorize set to true
  colorize: true, // Color the text and status code, using the Express/morgan color palette (text: gray, status: default green, 3XX cyan, 4XX yellow, 5XX red).
  ignoreRoute: function (req, res) { return false; } // optional: allows to skip some log messages based on request and/or response
}));

app.use('/', routesIndex);
app.use('/comments', routesComments);
app.use('/articles', routesArticles);
app.use('/auth', routesAuth);
app.use('/accounts', routesAccounts);
app.use('/roles', routesRoles);

// ROUTER LOGGING - AFTER routers BEFORE handlers
app.use(expressWinston.errorLogger({
  winstonInstance: logger,
}));

// ERROR HANDLERS
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});
if (app.get('ENV') === 'development') {
  app.use(function(err, req, res, next) {
    // winston.error(err.message, err)
    res.status(err.status || 500);
    res.send({
      status: err.status,
      message: err.message,
      stack: err.stack
    });
  });
}
app.use(function(err, req, res, next) {
  // winston.error(err.message, err)
  res.status(err.status || 500);
  res.send({
    status: err.status,
    message: err.message
  });
});

module.exports = app;