const Validation = require('./config/Validate.js');
//The function to validate the input forms
const ValidateSignupForm  = Validation.ValidateSignupForm;
const ValidateLoginForm = Validation.ValidateLoginForm;

const Message = require('./models/message.js');
//all api endpoints defined here


module.exports = ( app,passport,io )=>{
  //api end points handling get and post methods
  app.get('/',(req,res)=>{
    res.send('login page')
  })
  app.get('/api/messages/',(req,res)=>{
    Message.find({}).then(user=>{
      res.json(user)
    })
  })
  app.post('/api/messages/',(req,res)=>{
    console.log('posted');
    Message.create({
      name:req.body.name,
      message:req.body.message,
    }).then(message =>{
      res.json(message)
      io.emit('new message', message ,broadcast=true)
    })


  })
  // process the signup form
  app.post('/signup',(req,res,next)=>{
    const validationResult = ValidateSignupForm(req.body);
    if (!validationResult.success) {
      return res.status(400).json({
        success: false,
        message: validationResult.message,
        errors: validationResult.errors
      });
    }
    return passport.authenticate('local-signup', (err,user,message)=>{
      if (message ) {
      return res.status(400).json({
         success: false,
         message:'This email is already taken.'

       });
    }
    return res.status(200).json({
        success: true,
        message: 'You have successfully signed up! Now you should be able to log in.'
      });
  })(req,res,next);
  });

app.post('/login',(req,res,next)=>{
  const validationResult = ValidateLoginForm(req.body);
  if (!validationResult.success) {
    return res.status(400).json({
      success: false,
      message: validationResult.message,
      errors: validationResult.errors
    });
  }

  return passport.authenticate('local-login',(err,token,userData)=>{
    if (err) {
      if (err.name==='IncorrectCredentialsError') {
        return res.status(400).json({
          success:false,
          message:err.message
        });
      }
      return res.status(400).json({
        success:false,
        message:'Could not process the form'
      });
    }
    return res.json({
      success:true,
      message:'You have successfully logged in!',
      token,
      user:userData
    });
  })(req, res, next);
});

}
