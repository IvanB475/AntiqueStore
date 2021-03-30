const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const csrf = require('csurf');
const multer = require('multer');
const uuidv4 = require('uuid/v4');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const fs = require('fs');
require('dotenv').config();
const rateLimit = require("express-rate-limit");

//mongoose schema
const User = require('./models/user');

//env variables
const PORT = process.env.PORT || 5000;
const IP = process.env.IP || '0.0.0.0';

//dynamic requiring of routes files in routes folder
fs.readdir('routes', (err, routes) => {
  routes.forEach(routesFile => {
    const route = require("./routes/" + routesFile);
    app.use(route);
  })
});

//db setup
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/test';
mongoose.set('useFindAndModify', false);
const app = express();
const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: 'sessions',
  expires: 1000 * 60 * 60 * 12,
});



//file upload 
const fileStorage = multer.diskStorage({
  destination: function(req, file, cb) {
      cb(null, 'images');
  },
  filename: function(req, file, cb) {
      cb(null, uuidv4())
  }
});

const fileFilter = (req, file, cb) => {
  if(
      file.mimetype === 'image/png' ||
      file.mimetype === 'image/jng' ||
      file.mimetype === 'image/jpeg'||
      file.mimetype === 'image/pdf'
  ) {
      cb(null, true);
  } else {
      cb(null, false);
  }
}

app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single('image')
);


//session 
app.use(
  session({
    secret: process.env.EXPRESS_SECRET,
    resave: false,
    saveUninitialized: false,
    store: store
  })
);



//passport
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



//generic setup
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/images', express.static(path.join(__dirname, 'images')));
app.set('view engine', 'ejs');
app.set('views', 'views');



// CSRF token
const csrfProtection = csrf();
app.use(csrfProtection);


//track ip addresses from where requests are coming
app.use((req, res, next) => {
  let ip = req.connection.remoteAddress.split(`:`).pop();
  console.log(ip);
  next();
})

//setup currentUser and csrfToken via locals for simplicity
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.csrfToken = req.csrfToken();
  next();
});

//basic rate limiter setup
const limiter = rateLimit({
  windowMs: 2 * 60 * 1000, 
  max: 100
});

app.use(limiter);



//connect to mongoose and start the app
mongoose.connect(MONGODB_URI, {useNewUrlParser: true})
  .then(() => {
    app.listen(PORT, '0.0.0.0');
    console.log("app listening on " + IP + ':' + PORT);
  })
  .catch(err => {
    console.log(err);
  });