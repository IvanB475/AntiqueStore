const nodemailer = require('nodemailer');


exports.getLandingPage = (req, res) => {
    res.render('index/landing', {path: '/'});
}

exports.postInquiry = (req, res) => {
    const smtpTransport = nodemailer.createTransport({
      service: 'Gmail', 
      auth: {
        user: process.env.GMAILUSER,
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
    res.render('index/landing', {path: '/'});
 };