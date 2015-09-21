var sendgrid = require('sendgrid')('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');
var env = process.env.NODE_ENV = process.env.NODE_ENV || 'development';
var host =  env !== 'development' ? 'https://murbile.herokuapp.com/v/' : 'http://127.0.0.1:3000/v/';
module.exports.sendgrid = function (email, url) {
  console.log('sendgrid data * * * : ', email, host + url);
  sendgrid.send({
    to: email,
    from: 'arminbastian@gmail.com',
    subject: 'Welcome to Murmur, please verify email',
    text: 'Hi sport, please click this email to activate your account: ' + host + url
  },
  function (err, json) {
    if(err) {return console.error(err);}
    console.log('sendgrid json:', json);
  });
};



