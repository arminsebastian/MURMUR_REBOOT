var sendgrid = require('sendgrid')('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');
var urlHtml ='';
var host =  host ||'http://127.0.0.1:3000/v/';
module.exports.sendgrid = function (email, url) {
  console.log('sendgrid data * * * : ', email, url, host)
  sendgrid.send({
    to: 'a@factorum.com.mx',
    from: 'arminbastian@gmail.com',
    subject: 'Welcome to Murmur, please verify email',
    text: 'Hi sport, please click this email to verify your account: ' + host + url
  },
  function (err, json) {
    if(err) {return console.error(err);}
    console.log('sendgrid api error:', json);
  });
};



