var passport = require('passport'); // Authentication Framework
var LocalStrategy = require('passport-local').Strategy; // Authentication Strategy
var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;
var Account = require('../model/accounts');
var bcrypt = require('bcryptjs');

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
exports.isAuthenticated = function(req, res, next) {
  if(exports.extractJwt(req)) { 
    // JWT based authen check
    try {
      // Custom Authentication Callback for PassportJS
      passport.authenticate(
        'local-jwt',
        (err, user, info) => {
          if (err) { 
            next(err); 
          }
          else if (!user) {
            next(info); 
          }
          else {
            req.logIn(user, (err) => {
              if (err) { 
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
      next(err)
    }
  }
  else { // Implies Session based Authentication
    if(req.isAuthenticated()) 
      next();
    else {
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
    secretOrKey: 'Super Secret Password!!',
    jwtFromRequest: exports.extractJwt
  },
  (req, jwt_payload, next) => {
    var user = jwt_payload;
    next(null, user)
    // Technically not necessary to verify credentials here.
    // If this function is reach it is already implied that
    // the user is authenticated via a valid signed token found in the HttpOnly cookies and/or auth header.
    // This password middleware is executed on each request, 
    // it would sub-optiminal to validate user credentials against database on each request, 
    // which contrasts other session based strategies that
    // only validate credentials on login requests (not all requests).
  })
);
passport.serializeUser(function(account, done) {
  done(null, JSON.stringify(account));
  // done(null, account.id);
});
passport.deserializeUser(function(account, done) {
  done(null, JSON.parse(account));
  // done(err, { id: '1234', username: 'Josh' });
});