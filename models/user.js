//import mongoose for connect to mongoDb
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

//Schema instance created
let Schema = mongoose.Schema;

// schema definition

const userSchema = new Schema({
  name:String,
  password:String,
  email:{
    type:String,
    index:{ unique: true }
  }
});

userSchema.methods.comparePassword = (password,hashPass,callback)=>{
  bcrypt.compare(password,hashPass,callback)
}
userSchema.pre('save', function saveHook(next) {
  const user = this;

  // proceed further only if the password is modified or the user is new
  if (!user.isModified('password')) return next();

  return bcrypt.hash(user.password, 10, (hashError, hash) => {
      if (hashError) { return next(hashError); }

      // replace a password string with hash value
      user.password = hash;

      return next();
    });

});

const User = mongoose.model('User',userSchema);

module.exports = User;
