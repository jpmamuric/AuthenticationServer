const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');

//Define model
const userSchema = new Schema({
  email: { type: String, unique: true, lowercase: true },
  password: String
});

//before password Save Hook an encrypted password
userSchema.pre('save', function(next){
  //get access to the user model
  const USER = this;

  //generate a salt (randomly generated str of characters) then run call back
  bcrypt.genSalt(10, function(err, salt){
    if(err) {return next(err);}

    //hash (encrypt) our password using the salt
    bcrypt.hash(USER.password, salt, null, function(err, hash){
      if(err) {return next(err);}

      //overwrite plain text pasword with encrypted password
      USER.password = hash;
      next();
    });
  });
});

userSchema.methods.comparePassword = function(candidatePassword, callback){
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch){
    if (err) { return callback(err); }

    callback(null, isMatch);
  });
}

//Create the model class
const UserClass = mongoose.model('user', userSchema);

//Export the model
module.exports = UserClass;


//salt + plain password = Hashed Password + salt
