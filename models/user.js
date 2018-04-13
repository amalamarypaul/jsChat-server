//import mongoose for connect to mongoDb
const mongoose = require('mongoose');

//Schema instance created
let Schema = mongoose.Schema;

// schema definition

const userSchema = new Schema({
  username:String,
  password:String,
  email:String
})

const User = mongoose.model('User',userSchema);

module.exports = User;
