const passport = require('passport');
const User = require('../models/user');
const config  = require('../config');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const LocalStrategy = require('passport-local').Strategy;

//Create Local Strategy
const localOptions = { usernameField: 'email' };
const localLogin = new LocalStrategy( localOptions , function(email, password, done){
  User.findOne( { email: email }, function(err, user){
    if (err) { return done(err); }
    if (!user) {
      return done(null, false, { message: 'incorrect username'});
    }

  //compare passwords
    user.comparePassword(password, function(err, isMatch){
      if (err) { return done(err); }
      if (!isMatch) { return done(null, false); }
      return done(null, user);
    });
  });
});


//Setup options for JWT Strategy
const jwtOptions = {
  jwtFromRequest : ExtractJwt.fromHeader('authorization'),
  secretOrKey: config.secret
};

//Create JWT strategy
//payload: is decoded jwt token,
const jwtLogin = new JwtStrategy(jwtOptions, function(payload, done){
  //check is user id in payload exists
  User.findById( payload.sub , function(err, user){
    if (err) { return done(err, false); }
    if (user) {
      done(null, user);
    } else {
      done(null, false);
    }
  });
});

//Tell Passport to use this strategy
passport.use(jwtLogin);
passport.use(localLogin);
