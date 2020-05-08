const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');


router.get("/", (req, res) => {
    res.render('index/landing', {path: '/'});
});

router.post('/landing', (req, res) => {
     const smtpTransport = nodemailer.createTransport({
       service: 'Gmail', 
       auth: {
         user: procces.env.GMAILUSER,
         pass: process.env.GMAILPW
       }
     });
     const mailOptions = {
       to: process.env.CONTACTMAIL,
       from: process.env.GMAILUSER,
       subject: 'Kontakt!',
       text: 'Dobili ste pitanje od: ' + req.body.name + '\n\n' +
         'Email za odgovor je: ' + req.body.email + '\n\n' +
         'Pitanje je: ' + req.body.message + '\n'
     };
     smtpTransport.sendMail(mailOptions, (err) => {
       console.log('upitnik poslan');
     });
     req.flash('Uspješno poslano');
     res.render('index/landing', {path: '/'});
  });




module.exports = router;