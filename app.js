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


const User = require('./models/user');
const PORT = process.env.PORT || 5000;
const IP = process.env.IP || '0.0.0.0';


fs.readdir('routes', (err, files) => {
  files.forEach(file => {
    const route = require("./routes/" + file);
    app.use(route);
  })
});

const MONGODB_URI = process.env.MONGODB_URI;
mongoose.set('useFindAndModify', false);
const app = express();
const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: 'sessions'
});
const csrfProtection = csrf();

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

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(
  session({
    secret: process.env.EXPRESS_SECRET,
    resave: false,
    saveUninitialized: false,
    store: store
  })
);
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single('image')
);
app.use(express.static(path.join(__dirname, 'public')));
app.use('/images', express.static(path.join(__dirname, 'images')));


app.use(csrfProtection);

app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then(user => {
      if (!user) {
        return next();
      }
      req.user = user;
      next();
    })
    .catch(err => {
      next(new Error(err));
    });
});



app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.csrfToken = req.csrfToken();
  next();
});



mongoose
  .connect(MONGODB_URI, {useNewUrlParser: true})
  .then(result => {
    app.listen(PORT, '0.0.0.0');
    console.log("app started on" + PORT + IP);
  })
  .catch(err => {
    console.log(err);
  });