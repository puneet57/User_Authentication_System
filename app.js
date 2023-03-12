const express =require("express");
const expressLayouts=require('express-ejs-layouts');
const mongoose=require('mongoose');
const flash =require('connect-flash');
const session=require('express-session');
const passport=require('passport');
const app=express();
//passport config
require("./config/passport")(passport);
//db config
const db=require('./config/keys').MongoURI;
mongoose.connect(db,
    {
      useNewUrlParser: true,
    })
    .then(() => {
      console.log('Connected to database !!');
    })
    .catch((err)=>{
      console.log('Connection failed !!'+ err.message);
    });

//ejs
app.use(expressLayouts);
app.set('view engine','ejs');

//Bodyparser
app.use(express.urlencoded({extended:false}));
//express session
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true

}));
//passport middleware
app.use(passport.initialize());
app.use(passport.session());
//app flash
app.use(flash());
//
app.use((req,res,next)=>{
  res.locals.success_msg=req.flash('success_msg');
  res.locals.error_msg=req.flash('error_msg');
  res.locals.error=req.flash('error');
  next();
})

const PORT=process.env.PORT||5000;

//routes
app.use('/',require('./routes/index'))
app.use('/users',require('./routes/users'))

app.listen(PORT,console.log(`server started on ${PORT}`));