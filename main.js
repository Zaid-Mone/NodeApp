require('dotenv').config();
const express = require('express');
const session = require('express-session');
//mongoose configuration
const db = require('./config/db')
// routes
const userRouter = require('./routes/user-routes')
var methodOverride = require('method-override')
const app = express();
const PORT =process.env.PORT || 4000;

// MidlleWare
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(express.static('wwwroot'));
app.use(express.static('uploads'));
app.use(methodOverride('_method'))
app.use(session({
   secret:process.env.SECRET_KEY,
   resave:false,
   saveUninitialized:true
}))
// app.use((req, res, next) => {
//    req.locals.message = req.session.message;
//    delete req.session.message;
//    next(); 
// })
//ejs
app.set('view engine', 'ejs');
// routes
app.use('',userRouter);
app.listen(PORT,()=>{
   console.log(`working on port ${PORT}`);
})
