var passport = require('passport'); // Authentication Framework
var PassportLocalStrategy = require('passport-local').Strategy; // Authentication Strategy
var Account = require('../model/accounts');
var bcrypt = require('bcryptjs');

passport.use('local', new PassportLocalStrategy(
  {
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true,
    session: true
  },
  (req, email, password, next) => {
    Account.read(
      {
        query: {
          email: email
        }
      })
      .then((results) => {
        if(results.length > 0) {
          var account = results[0]; // Should only return 1 account match
          if(!bcrypt.compareSync(password, account.passwordHashAndSalt)) {
            var error = new Error('Password incorrect.')
            error.status = 401
            return next(null, false, error)
          }
          else {
            return next(null, account)
          }
        }
        else {
          var error = new Error('Account not found.')
          error.status = 404
          return next(null, false, error)
        }
      })
      .catch((err) => {
        return next(err)
      });
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

exports.getPassport = function() {
  return passport;
}
exports.isAuthenticated = function(req, res, next) {
  if(req.isAuthenticated()) {
    return next()
  }
  else {
    var err = new Error('Login required.. you are not authenticated.')
    err.status = 401
    next(err)
  }
}
