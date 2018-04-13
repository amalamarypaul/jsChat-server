//import packages
const express = require('express');
const parseurl = require('parseurl');
const bodyParser = require('body-parser');
const path = require('path');
const expressValidator = require('express-validator');
const mongoose = require('mongoose');
const http = require('http');
const socketIO = require('socket.io');
const Message = require('./models/message.js');
//app instance
const app = express();

// body parser -middleware for handling JSON, Raw, Text and URL encoded form data.
app.use(bodyParser.json());

//Enabling cross origin resource sharing
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
//create server instance
const server = http.createServer(app);

// This creates our socket using the instance of the server
const io = socketIO(server)


//url to connect database and use connect()
const url = 'mongodb://localhost:27017/messageboard';

mongoose.connect(url,(err,db)=>{
  if(err){
    console.log('Unable to connect, Error:',err);
  } else{
    console.log('Connection estblished');
  }
})

//api end points handling get and post methods
app.get('/',(req,res)=>{
  res.send('login page')
})
app.get('/api/message/',(req,res)=>{
  User.find({}).then(user=>{
    res.json(user)
  })
})
app.post('/api/message/',(req,res)=>{
  console.log('posted');
  Message.create({
    name:req.body.name,
    message:req.body.message,
  }).then(message =>{
    res.json(message)
    io.emit('new message', message ,broadcast=true)
  })


})

//listening at localhost port 3000
server.listen(3000,()=>{
  console.log('App is listening at port 3000');
})
