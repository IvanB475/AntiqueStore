const User = require("../models/user");
const passport = require('passport');
const nodemailer = require("nodemailer");
const crypto = require('crypto');
require('../middleware/index')();


exports.postSignUp = (req, res) => {
  req.body.username = req.body.username.toLowerCase();
  const newUser = new User({username: req.body.username, email: req.body.email, status: "member", cart: { items: [] }});
  User.register(newUser, req.body.password).then(user => { 
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
    smtpTransport.sendMail(mailOptions).then(() => { 
        console.log('mail sent to' + user.email);
    }).catch(err => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    })
    passport.authenticate("local")(req,res, () => {
        res.redirect("/books");
    })
  }).catch(err => {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  })
};

exports.postLogin = 
  passport.authenticate("local", {
    successRedirect: "/books",
    failureRedirect: "/login"
  }), () => {
}


exports.postAdminRegister = (req, res) => {
    if (req.body.code === process.env.ADMIN_CODE){
        let update = { status: "admin"};
        User.findByIdAndUpdate(req.user._id, update).then(() => {
            res.render("users/settings", { path: 'users/settings'});
        }).catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
    } else {
        res.redirect("/");
    }
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
    const token = crypto.randomBytes(32).toString('hex');
    User.findOne({ email: req.body.email }).then(user => {
          /**Creates token */
          user.resetPasswordToken = token;
          /** Token duration */
          user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
          user.save();
          let smtpTransport = nodemailer.createTransport({
            service: 'Gmail', 
            auth: {
              user: process.env.GMAILUSER,
              pass: process.env.GMAILPW
            }
          })
          let mailOptions = {
            to: user.email,
            from: process.env.GMAILUSER,
            subject: 'Node.js Password Reset',
            text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
              'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
              'http://' + req.headers.host + '/reset/' + token + '\n\n' +
              'If you did not request this, please ignore this email and your password will remain unchanged.\n'
          };
          smtpTransport.sendMail(mailOptions).then(() => {
            console.log("reset email sent");
            res.redirect('/login');
          }).catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
          })
    }).catch(err => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    })
};


exports.postResetToken = (req, res, next) => {
    User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now()}}).then(user => {
      if(req.body.password === req.body.confirm) {
        user.setPassword(req.body.password).then(() => {
          user.resetPasswordToken = undefined;
          user.resetPasswordExpires = undefined;
          user.save();
        }).catch(err => {
          const error = new Error(err);
          error.httpStatusCode = 500;
          return next(error);
        })
      } else {
        return res.redirect('back');
      }
      var smtpTransport = nodemailer.createTransport({
        service: 'Gmail', 
        auth: {
          user: process.env.GMAILUSER,
          pass: process.env.GMAILPW
        }
      });
      var mailOptions = {
        to: user.email,
        from: process.env.GMAILUSER,
        subject: 'Your password has been changed',
        text: 'Hello,\n\n' +
          'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
      };
      smtpTransport.sendMail(mailOptions).then(() => {
        console.log("password resetted successfully");
        req.logIn(user, err => {
          if (err) console.log(err);
        });
        res.redirect('/books');
      }).catch(err => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
      })
    })
};

exports.getResetToken = (req, res, next) => {
    User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now()}}).then(() => { 
      res.render('users/resetpw', {token: req.params.token});
    }).catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
}

exports.postLogout = (req, res) => {
  req.logout();
  res.redirect("/");
}

exports.getReset = (req, res) => {
  res.render('users/reset', { path: 'users/reset', errorMessage: null});
}


exports.getAdminRegister = (req, res) => {
  res.render("users/admin-register", {path: 'users/admin-register'})
}


exports.getSettings = (req,res, next) => {
    User.findById(req.user._id).then(foundUser => {
      res.render("users/settings", {path: 'users/settings', user: foundUser})
    }).catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
}

exports.getLogin = (req, res) => {
  res.render("users/login",  {path: 'users/login'});
};

exports.getSignUp = (req, res) => {
  res.render("users/signup",  {path: 'users/signup'});
}