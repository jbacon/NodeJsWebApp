var passport = require('passport'); // Authentication Framework
var LocalStrategy = require('passport-local').Strategy; // Authentication Strategy
var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;
var Account = require('../model/accounts');
var bcrypt = require('bcryptjs');

exports.getPassport = function() {
  return passport;
}
exports.ExtractJwtFromReqCookie = function(req) {
    var token = null;
    if (req && req.cookies)
    {
        token = req.cookies['jwt'];
    }
    return token;
};
exports.isAuthenticated = function(req, res, next) {
  // Check for Json Web Token found (implies JWT based Authentication)
  if(exports.ExtractJwtFromReqCookie(req)) { 
    // JWT based authen check
    try {
      passport.authenticate(
        'local-jwt',
        (err, user, info) => {
          if (err) { 
            next(err); 
          }
          if (!user) {
            var error = new Error('')
            error.status = 401
            next(err); 
          }
          req.logIn(user, function(err) {
            if (err) { return next(err); }
            return res.redirect('/users/' + user.username);
          });
        })(req, res, next)
    }
    catch(e) {
      throw e
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
    jwtFromRequest: exports.ExtractJwtFromReqCookie
  },
  (req, jwt_payload, next) => {
    var user = jwt_payload;
    next(null, user)
    // Technically not necessary to verify credentials here.
    // If this function is reach it is already implied that
    // the user is authenticated via the valid signed token found in the HttpOnly cookies.
    // This password middleware is executed on each request, 
    // it would not be optiminal to validate user credentials against database on each request, 
    // which contrasts session based strategies that
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