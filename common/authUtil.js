var passport = require('passport'); // Authentication Framework
var LocalStrategy = require('passport-local').Strategy; // Authentication Strategy
var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;
var FacebookStrategy = require('passport-facebook').Strategy;
var Account = require('../model/accounts');
var bcrypt = require('bcryptjs');
var config = require('../config.json');

exports.getPassport = function() {
  return passport;
}
exports.extractJwt = function(req) {
    // Check Cookies
    var token = null;
    if (req)
    {
      if(req.cookies && req.cookies['JWT']) {
        token = req.cookies['JWT'];
      }
      else if(req.headers && req.headers['Authorization']) {
        token = req.headers['Authorization']
      }
    }
    return token;
};
exports.isAdmin = function(req, res, next) {
  if(req.user.email === config.adminEmail) {
    next()
  }
  else {
      var error = new Error('Account requires Adminstrative Account..')
      error.status = 401
      next(error)
  }
}
exports.isAuthenticated = function(req, res, next) {
  var jwtToken = exports.extractJwt(req)
  if(jwtToken) { // If JWT found... 
    try { // Try to authenticate...
      passport.authenticate(
        'local-jwt',
        (err, user, info) => {
          if (err) { 
            res.clearCookie('loggedInUser');
            res.clearCookie('JWT');
            next(err); 
          }
          else if (!user) {
            res.clearCookie('loggedInUser');
            res.clearCookie('JWT');
            next(info); 
          }
          else {
            req.logIn(user, (err) => {
              if (err) { 
                res.clearCookie('loggedInUser');
                res.clearCookie('JWT');
                next(err); 
              }
              else {
                next();
              }
            });
          }
        })(req, res, next)
    }
    catch(e) {
      res.clearCookie('loggedInUser');
      res.clearCookie('JWT');
      next(e)
    }
  }
  else { // else Session...
    if(req.isAuthenticated()) {
      next();
    }
    else {
      res.clearCookie('loggedInUser');
      res.clearCookie('JWT');
      var error = new Error('Login required, you are not authenticated..')
      error.status = 401
      next(error)
    }
  }
}
passport.use('local-session', new LocalStrategy(
  {
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true,
    session: true
  },
  (req, email, password, next) => {
    Account.read(
      {
        query: { email: email }
      })
      .then((results) => {
        if(results.length > 0 && !bcrypt.compareSync(password, results[0].passwordHashAndSalt)) {
          var error = new Error('Password incorrect.')
          error.status = 401
          next(null, false, error)
        }
        else if(results.length > 0) {
          next(null, results[0])
        }
        else {
          var error = new Error('Account not found.')
          error.status = 404
          next(null, false, error)
        }
      })
      .catch((err) => {
        next(err)
      });
  })
);
passport.use('local-jwt', new JwtStrategy(
  {
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true,
    session: false,
    secretOrKey: config.jwtSecret,
    jwtFromRequest: exports.extractJwt
  },
  (req, jwt_payload, next) => {
    // Technically not necessary to verify credentials here.
    // If this function is reach it is already implied that
    // the user is authenticated via a valid signed token found in the HttpOnly cookies and/or auth header.
    // This password middleware is executed on each request, 
    // it would sub-optiminal to validate user credentials against database on each request, 
    // which contrasts other session based strategies that
    // only validate credentials on login requests (not all requests).
    var user = jwt_payload;
    // Refresh jwt...
    next(null, user)
  })
);

passport.use('facebook', new FacebookStrategy({
    clientID: config.facebookAppID,
    clientSecret: config.facebookAppSecret,
    callbackURL: config.serverUrl+':'+config.serverPort+'/auth/facebook/callback',
  },
  function(accessToken, refreshToken, profile, next) {
    // Find or Create Account!
    Account.read(
    {
      query: { facebookProfileID: profile.id }
    })
    .then((results) => {
      if(results.length > 0) {
        // Account found!!
        next(null, results[0]);
      }
      else {
        // Account NOT found!
        // Try Creating new Account!!
        var account = new Account({
          facebookProfileID: profile.id,
          nameFirst: 'bob',
          nameLast: 'bob',
          email: profile.email,
          password: bcrypt.hashSync('dummy', 10)
        })
        Account.create({ account: account })
        .then((results) => {
          next(null, false, results.ops[0])
        })
        .catch((err) => {
          // Account create failed!
          next(err)
        });
      }
    })
    .catch((err) => {
      // Account read failed!
      next(err)
    });
  }
))

passport.serializeUser(function(account, done) {
  done(null, JSON.stringify(account));
  // done(null, account.id);
});
passport.deserializeUser(function(account, done) {
  done(null, JSON.parse(account));
  // done(err, { id: '1234', username: 'Josh' });
});