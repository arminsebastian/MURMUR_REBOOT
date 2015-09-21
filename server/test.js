var handler = require('./helpers.js');
var expect = require('./node_modules/chai/chai').expect;
var server = require('./server.js').server;
var auth =  require('./auth.js');
var request = require('request');


describe('handler functions', function(){
  // var server;
  //   beforeEach(function () {
  //     server = require('./server', { bustCache: true });
  //   });
    // afterEach(function (done) {
    //   done();
    // });
  
  // var options = {
  //   'method': 'POST',
  //   'followAllRedirects': true,
  //   'uri': 'http://127.0.0.1:4568/login',
  //   'json': {
  //     'username': 'Phillip',
  //     'password': 'Phillip'
  //   }
  // };
  // // login via form and save session info
  // requestWithAuth(options, function(error, res, body) {
  //   done();
  // });
  // var requestWithAuth = request.defaults();

  // beforeEach(function(done){      // create a user that we can then log-in
  //   var options = {
  //     'method': 'POST',
  //     'followAllRedirects': true,
  //     'uri': 'http://127.0.0.1:3000/signin',
  //     'json': {
  //       'email': 'asdf',
  //       'password': 'asdf'
  //     }
  //   };

  //   // login via form and save session info
  //   requestWithAuth(options, function(error, res, body) {
  //     done();
  //   });
  // });

  describe('signin', function() {

    var options = {
      'method': 'POST',
      'followAllRedirects': true,
      'uri': 'http://127.0.0.1:3000/signin',
      'json': {
        'email': 'asdf',
        'password': 'asdf'
      }
    };


    var requestWithAuth = request.defaults();

    it('should have a signin function', function(){
      expect(typeof handler.signin).to.equal('function');
    });

    it('should sign someone in (server sends back signedIn: true)', function() {
      requestWithAuth(options, function(error, res, body) {
        expect(body.signedIn).to.equal(true);
      });
    });

    it('should send back token if auth-d (server sends back token: token)', function() {
      requestWithAuth(options, function(error, res, body) {
        expect(body.token).to.not.equal(undefined);
      });
    });

    it('should send back an array of rooms associated with that account if auth-d (server sends back rooms: rooms)', function() {
      requestWithAuth(options, function(error, res, body) {
        expect(Array.isArray(body.rooms)).to.be(true);
      });
    });

    it('should reject an incorrect password (server sends back signedIn: false)', function() {
      
      var options = {
        'method': 'POST',
        'followAllRedirects': true,
        'uri': 'http://127.0.0.1:3000/signin',
        'json': {
          'email': 'asdf',
          'password': 'fdsa'
        }
      };
      requestWithAuth(options, function(error, res, body) {
        expect(body.signedIn).to.equal(false);
      });
    });

  });
  

  it('should have a verify function', function(){
    expect(typeof handler.verify).to.equal('function');
  });

  it('should have a signup function', function(){
    expect(typeof handler.signup).to.equal('function');
  });

  it('should have a createRoom function', function(){
    expect(typeof handler.createRoom).to.equal('function');
  });

  it('should have a checkRoomExists function', function(){
    expect(typeof handler.checkRoomExists).to.equal('function');
  });

  it('should have a addMessage function', function(){
    expect(typeof handler.addMessage).to.equal('function');
  });

  it('should have a updateFavorites function', function(){
    expect(typeof handler.updateFavorites).to.equal('function');
  });

  it('should have a vote function', function(){
    expect(typeof handler.vote).to.equal('function');
  });
});

// describe('auth functions', function(){
//   it('should have a createUser function', function(){
//     expect(typeof auth.createUser).to.equal('function');
//   });

//   it('should have a resetPassword function', function(){
//     expect(typeof auth.resetPassword).to.equal('function');
//   });

//     it('should have a checkAuth function', function(){
//     expect(typeof auth.checkAuth).to.equal('function');
//   });
// });
