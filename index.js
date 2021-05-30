const express = require('express');
const nodemailer = require('nodemailer');
const twoFactor = require('node-2fa');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
const port = 3000
app.use(bodyParser.json());

var codeMain = null;
var secretMain = null;
function sendEmail(email) {
  const secret = twoFactor.generateSecret({ name: "My Awesome App", account: "johndoe" });
  const token = twoFactor.generateToken(secret.secret);
  codeMain = token.token;
  secretMain = secret.secret;
  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'gamaceagaming@gmail.com',
      pass: 'gamacea@771'
    }
  });

  var mailOptions = {
    from: 'gamaceagaming@gmail.com',
    to: email,
    subject: 'Two Step Verification',
    text: 'Your Verification code is \n'+token.token,
  };

  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
}

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  console.log(req.body);
  res.render('emailId');
})

app.post('/', (req, res) => {
  console.log(req.body);
  sendEmail(req.body.email);
  res.redirect('/veri');
})

app.get('/veri', (req, res) => {
  res.render('verification');
})

app.post('/veri', (req, res) => {
  console.log(req.body.code, codeMain);
  console.log(twoFactor.verifyToken(secretMain, req.body.code));
  if(twoFactor.verifyToken(secretMain, req.body.code)){
    console.log("Correct");
    res.redirect('/success');
  }
  else {
    console.log("Incorrect");
    res.redirect('/');
  }
})

app.get('/success', (req, res) => {
  res.render('Success');
})


app.listen(port, ()=>{
  console.log("server started");
})