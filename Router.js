const Message = require('./models/message.js');
//all api endpoints defined here


module.exports = ( app,passport,io )=>{
  //api end points handling get and post methods
  app.get('/',(req,res)=>{
    res.send('login page')
  })
  app.get('/api/message/',(req,res)=>{
    Message.find({}).then(user=>{
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
  // process the signup form
  app.post('/signup', passport.authenticate('local-signup', {
      successRedirect : '/api/message', // redirect to the secure profile section
      failureRedirect : '/signup', // redirect back to the signup page if there is an error
  }));
  app.get('/signup',(req,res)=>{
    console.log(req.signupMessage);
  })
}
