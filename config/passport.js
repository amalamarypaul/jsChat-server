const LocalStrategy = require('passport-local').Strategy;

const User = require('../models/user');

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
    usernameField : 'username',
    passwordField : 'password',
    passReqToCallback : true
  },
(req,username,password,done)=>{

  process.nextTick(()=>{
    User.findOne({'username':username},(err, user) =>{
      if (err) {
        return done(err);
      }
      if (user) {
        req.body={
          signupMessage: 'That email is already taken.'
        }
        return done(null, false, {signupMessage: 'That email is already taken.'});
      } else {
        const newUser = new User();
        newUser.username = username;
        newUser.password = password;
        newUser.email = req.body.email;
        newUser.save((err)=>{
          if (err){
            console.log(err);
            throw err;
          }

          return done(null, newUser);
        });
      }

    });
  });
}));

};
