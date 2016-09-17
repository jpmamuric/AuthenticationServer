const User = require('../models/user');
const jwt =  require('jwt-simple');
const config = require('../config');

function tokenForUser(user) {
  const timestamp = new Date().getTime();
  return jwt.encode({ sub: user.id, iat: timestamp }, config.secret)
}

exports.login = function(req, res, next) {
  //given token when signed in
  res.send({token: tokenForUser(req.user)});
} 

exports.signup = function(req, res, next) {
  const EMAIL = req.body.email;
  const PASSWORD = req.body.password;

  if (!EMAIL || !PASSWORD){
    return res.status(422).send({ error: 'you must provide email and password'});
  }

  //see if given email exists
  User.findOne({email: EMAIL}, function(err, existingUser){
    if(err) { return next(err); }

  //if exists, return an error
    if(existingUser) {
      return res.status(422).send({ error: 'Email is already taken'});
    }

  //if DOES NOT exist, create an save user record
    const USER = new User ({
      email:EMAIL,
      password: PASSWORD
    });

    USER.save(function(err){
      if(err) {return next(err);}

      //respond to request
      res.json({ token: tokenForUser(USER) });
    });
  });
}
