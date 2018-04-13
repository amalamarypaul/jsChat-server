//import mongoose for connect to mongoDb
const mongoose = require('mongoose');

//Schema instance created
let Schema = mongoose.Schema;

//definition of userSchema, instance of Schema
const messageSchema = new Schema({
  name:{
    type:mongoose.Schema.Types.Mixed,
    required:true,
  },
  message:{
    type:mongoose.Schema.Types.Mixed,
    required:true,
  },
})

//model User mapped with userSchema
const Message = mongoose.model('Message', messageSchema)

module.exports = Message;
