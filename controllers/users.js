const User = require("../models/user");
const passport = require('passport');
const Book = require('../models/book');
const eBook = require('../models/eBook');
const nodemailer = require("nodemailer");
const crypto = require('crypto');
const async = require('async');
require('../middleware/index')();


exports.postSignUp = (req, res) => {
  const newUser = new User({username: req.body.username, email: req.body.email, status: "member", cart: { items: [] }});
  User.register(newUser, req.body.password, (err, user) => {
      if(err){
          return res.render("users/signup", { path: "users/signup"});
      } else {
              const smtpTransport = nodemailer.createTransport({
                service: 'Gmail', 
                auth: {
                  user: process.env.GMAILUSER,
                  pass: process.env.GMAILPW
                }
              });
              const mailOptions = {
                to: user.email,
                from: process.env.GMAILUSER,
                subject: 'Zahvaljujemo vam na registraciji!',
                text: 'Šaljemo vam ovaj mail kao potvrdu vaše registracije\n\n' +
                  'username:' + user.username + '\n\n' +
                  'Ako se niste vi registrirali, molimo vas obrišite račun\n'
              };
              smtpTransport.sendMail(mailOptions, function(err) {
                console.log('mail sent to' + user.email);
              });
            }
          passport.authenticate("local")(req,res, () => {
              res.render("index/landing", { path: "index/landing"});
          })
      
  })
};

exports.postLogin = 
  passport.authenticate("local", 
{
    successRedirect: "/settings",
    failureRedirect: "/login"
}), () => {
}


exports.postAdminRegister = (req, res) => {

    if (req.body.kod === "5c77dFhgU2771x&2#75"){
        let update = { status: "admin"};
    User.findByIdAndUpdate(req.user._id, update, (err) => {
        if(err) {
            res.redirect("/");
        } else {
            res.render("users/settings", { path: 'users/settings'});
        }
    } )
} else {
    res.redirect("/");
}
}

exports.postCart = (req, res, next) => {
  const bookId = req.body.bookId;
  Book.findById(bookId).then(book => {
      return req.user.addToCart(book);
  }).then(result => {
      res.redirect('/cart');
  }).catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
  })
};

exports.postCartEBook = (req, res, next) => {
  const bookId = req.body.bookId;
  eBook.findById(bookId).then(book => {
      return req.user.addToCart(book);
  }).then(result => {
      res.redirect('/cart');
  }).catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
  })
};

exports.postCartRemove = (req,res, next) => {
  const bookId = req.body.bookId;
  req.user.removeFromCart(bookId).then(result => {
      res.redirect('/cart');
  }).catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
  })
}

exports.postSettings = (req, res, next) => {
  const update = {email: req.body.email}
  User.findByIdAndUpdate(req.user._id, update).then(result => {
      res.render('index/landing', {path: '/'});
      console.log(result);
  }).catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
  })
}


exports.postReset = (req, res, next) => {
    async.waterfall([
        function(done) {
          crypto.randomBytes(32, (err, buf) => {
            let token = buf.toString('hex');
            done(err, token);
          });
        },
        function(token, done) {
          /** Find User
     * @param {Object} email: req.body.email - User's email
     * @param {Function} 
     */
          User.findOne({ email: req.body.email }, (err, user) => {
            if (!user) {
              console.log('error' + 'No account with that email address exists.');
              return res.redirect('/');
            }
    /**Creates token */
            user.resetPasswordToken = token;
    /** Token duration */
            user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    
            user.save(function(err) {
              done(err, token, user);
            });
          });
        },
    /** Function processing request
     * @param {String} token- token given for reseting password
     *  @param {User} user- user who made request
     */
        (token, user, done) => {
          let smtpTransport = nodemailer.createTransport({
            service: 'Gmail', 
            auth: {
              user: process.env.GMAILUSER,
              pass: process.env.GMAILPW
            }
          });
          let mailOptions = {
            to: user.email,
            from: process.env.GMAILUSER,
            subject: 'Node.js Password Reset',
            text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
              'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
              'http://' + req.headers.host + '/reset/' + token + '\n\n' +
              'If you did not request this, please ignore this email and your password will remain unchanged.\n'
          };
          smtpTransport.sendMail(mailOptions, (err) => {
            console.log('mail sent');
            req.flash('success', 'An e-mail has been sent to ' + user.email + ' with further instructions.');
            done(err, 'done');
          });
        }
      ], (err) => {
        if (err) return next(err);
        res.redirect('/');
      });
    };


exports.postResetToken = (req, res) => {
  async.waterfall([
    function(done) {
      /** Find User
 * @param {String} resetPasswordToken - Token for password reset.
 * @param {Callback} resetPasswordExpires - checks if token expired
 * @param {Function} 
 */
      User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, (err, user) => {
  /** if user not existing, send error message */
        if (!user) {
          req.flash('error', 'Password reset token is invalid or has expired.');
          return res.redirect('back');
        }
        if(req.body.password === req.body.confirm) {
          user.setPassword(req.body.password, function(err) {
            user.resetPasswordToken = undefined;
            user.resetPasswordExpires = undefined;

            user.save((err) => {
              req.logIn(user, function(err) {
                done(err, user);
              });
            });
          })
        } else {
            req.flash("error", "Passwords do not match.");
            return res.redirect('back');
        }
      });
    },
    function(user, done) {
/** mail protocol defined*/
      var smtpTransport = nodemailer.createTransport({
        service: 'Gmail', 
        auth: {
          user: process.env.GMAILUSER,
          pass: process.env.GMAILPW
        }
      });
      var mailOptions = {
        to: user.email,
        from: 'rubotester@gmail.com',
        subject: 'Your password has been changed',
        text: 'Hello,\n\n' +
          'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
      };
/** mail protocol */
      smtpTransport.sendMail(mailOptions, function(err) {
        req.flash('success', 'Success! Your password has been changed.');
        done(err);
      });
    }
  ], function(err) {
    res.redirect('/');
  });
};

exports.getResetToken = (req, res) => {
  User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, (err, user) => {
    if (!user) {
      req.flash('error', 'Password reset token is invalid or has expired.');
      return res.redirect('/');
    }
    res.render('users/resetpw', {token: req.params.token});
  });
}

exports.postLogout = (req, res) => {
  req.logout();
  res.redirect("/");
}

exports.getReset = (req, res) => {
  res.render('users/reset', { path: 'users/reset', errorMessage: null});
}

exports.getCheckout = (req,res, next) => {
  req.user.populate('cart.items.bookId').execPopulate().then(user => {
      const books = user.cart.items;
      let totalPrice = 0;
      books.forEach(b => {
          totalPrice += b.quantity * b.bookId.price;
      })
      res.render('users/checkout', {
          path: '/checkout',
          pageTitle: 'Vaša košarica',
          books: books,
          totalPrice: totalPrice
      });
  }).catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
  })
}

exports.getCart = (req, res, next) => {
  req.user.populate('cart.items.bookId').execPopulate().then(user => {
      const books = user.cart.items;
      const updatedBooks = [];
      books.forEach(bookId => {
              if(bookId.bookId === null) {
      user.removeFromCart(bookId._id);
              } else {
                  updatedBooks.push(bookId);
              }
      })
      res.render('users/cart', {
          path: '/cart',
          pageTitle: 'Vaša košarica',
          books: updatedBooks
      });
  }).catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
  })
}

exports.getAdminRegister = (req, res) => {
  res.render("users/admin-register", {path: 'users/admin-register'})
}


exports.getSettings = (req,res) => {
  User.findById(req.user._id, (err, foundUser) => {
      if(err) {
          return res.redirect("/");
      } else {
          res.render("users/settings", {path: 'users/settings', user: foundUser})
      }
  })
}

exports.getLogin = (req, res) => {
  res.render("users/login",  {path: 'users/login'});
};

exports.getSignUp = (req, res) => {
  res.render("users/signup",  {path: 'users/signup'});
}