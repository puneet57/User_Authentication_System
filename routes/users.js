const express=require('express')
const router=express.Router();
const bcrypt=require('bcryptjs');
const passport=require('passport');


//user model
const User=require('../models/user');

//login
router.get('/login',(req,res)=>  res.render("Login"));

//register
router.get('/register',(req,res)=>  res.render("Register"));

router.post('/register',(req,res)=>{
    const {name, email, password, password2}=req.body;

let errors = [];

if (!name || !email || !password || !password2) {
  errors.push({ msg: 'Please enter all fields' });
}

if (password !== password2) {
  errors.push({ msg: 'Passwords do not match' });
}

if (password.length < 6) {
  errors.push({ msg: 'Password must be at least 6 characters' });
}
if(errors.length>0){
    res.render('register',{
        errors,
        name,
        password,
        password2
    });
}else{
  User.findOne({ email: email }).then(user => {
    if (user) {
      errors.push({ msg: 'Email already exists' });
      res.render('register', {
        errors,
        name,
        email,
        password,
        password2
      });
    } else {
      const newUser = new User({
        name,
        email,
        password
      });
      //Hash password
      bcrypt.genSalt(10,(err,salt)=>
      bcrypt.hash(newUser.password,salt,(err,hash)=>{
        if(err) throw err;
        //Set password to hashed
        newUser.password=hash;
        //save user
        newUser.save()
        .then(user=>{
          req.flash('success_msg','You are now registered and log-in');
          res.redirect('/users/login')
        })
        .catch(err=>console.log(err));
      })
      )
    

      }
    });
}

});
//login handle
router.post('/login',(req,res,next)=>{
  passport.authenticate('local', { 
    successRedirect:'/dashboard',
    failureRedirect: '/users/login',
    failureFlash: true
  })(req,res,next);
});
//logout handle
router.get("/logout", function(req, res, next) {
  req.logout(function(err) {
    if (err) {
      return next(err);
    }
    req.flash('success_msg','you are logged out');
    res.redirect("/users/login");
  });
});
  
module.exports=router;
//module.exports.User = User