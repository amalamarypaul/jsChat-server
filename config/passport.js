const LocalStrategy = require('passport-local').Strategy;
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const configDB = require('./database');
const Validation = require('./Validate.js');
//The function to validate the
const ValidateSignupForm  = Validation.ValidateSignupForm;
const ValidateLoginForm = Validation.ValidateLoginForm;

// expose this function to our app using module.exports
module.exports = (passport) => {
  // used to serialize the user for the session
    passport.serializeUser((user, done)=> {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser((id, done)=> {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

  // signup
  passport.use('local-signup', new LocalStrategy({
    usernameField : 'email',
    passwordField : 'password',
    passReqToCallback : true
  },
(req,email,password,done)=>{

  process.nextTick(()=>{
    User.findOne({'email':email},(err, user) =>{
      if (err) {
        return done(err);
      }

      if (user) {
        const message={
          error:'That email is already taken'
        }
        return done(null,false, message );
      } else {
        const newUser = new User();
        newUser.email = email;
        newUser.password=password;
        newUser.name = req.body.name;
        newUser.save((err)=>{
          if (err){

            throw err;
          }
          return done(null, newUser);
        });
      }

    });
  });
}));

//login
passport.use('local-login', new LocalStrategy({
  usernameField : 'email',
  passwordField : 'password',
  passReqToCallback : true
},(req,email,password,done)=>{
  const currentUser = {
    email:email,
    password:password
  }
  const error = {
    name:'',
    message:''
  }
 return User.findOne({ email:currentUser.email}, (err,user)=>{

   if(err) { return done(err);}

   if(!user) {
     error.message= (' Incorrect email or password');
     error.name = 'IncorrectCredentialsError';
     return done(error,null,null);
   }
   console.log(user);
   return user.comparePassword(currentUser.password,user.password,(passwordErr,isMatch)=>{
      console.log(isMatch);
     if (passwordErr) {
       return done(err);
     }
     if(!isMatch){
       const error = new Error('Incorrect email or password')
       error.name='IncorrectCredentialsError';
       return done(error);
     }
     const payload={
       sub:user._id
     };

     const token = jwt.sign(payload,configDB.jwtSecret);
     console.log("user");
     const data ={
       name:user.name
     };
     return done(null,token,data);

   })
 })

}))
};
