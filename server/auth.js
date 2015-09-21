var Firebase = require('firebase');
var myDataRef = new Firebase('https://donkey.firebaseio.com/');

// Create New Users
module.exports.createUser = function(user, cb){
  myDataRef.createUser({
    "email": user.email,
    "password": user.password
  }, cb);
};

// Log user in
module.exports.login = function(user, authHandlers){
  myDataRef.authWithPassword({
    "email": user.email,
    "password": user.password
  }, authHandlers);
};

// TODO: Reset password
module.exports.resetPassword = function(user){
  myDataRef.resetPassword({
    email : user.email
  }, function(error) {
    if (error === null) {
      console.log("Password reset email sent successfully");
    } else {
      console.log("Error sending password reset email:", error);
    }
  });
};

// check current auth status
var checkAuth = module.exports.checkAuth = function(){
  var authData = myDataRef.getAuth();
  return authData;
  if (authData) {
    return true;
  } else {
    return false;
  }
}

