//import packages
const express = require('express');
const parseurl = require('parseurl');
const bodyParser = require('body-parser');
const path = require('path');
const expressValidator = require('express-validator');
const mongoose = require('mongoose');
const http = require('http');
const socketIO = require('socket.io');
const passport = require('passport');
const flash = require('connect-flash');


//url to connect database
const configDB = require('./config/database')
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




mongoose.connect(configDB.url,(err,db)=>{
  if(err){
    console.log('Unable to connect, Error:',err);
  } else{
    console.log('Connection estblished');
  }
})

//pass passport for configuration
require('./config/passport.js')(passport);
//required for paasport setup
app.use(passport.initialize());
//app.use(flash());
//app.use(passport.session());
//routes
require('./Router.js')(app,passport,io) //load routes and pass app and fully configured passport
//listening at localhost port 3000
server.listen(3000,()=>{
  console.log('App is listening at port 3000');
})
