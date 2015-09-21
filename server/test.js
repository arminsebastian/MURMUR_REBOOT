var handler = require('./helpers.js');
var expect = require('./node_modules/chai/chai').expect;
var server = require('./server.js').server;
var auth =  require('./auth.js');


describe('handler functions', function(){
  it('should have a signin function', function(){
    expect(typeof handler.signin).to.equal('function');
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

describe('auth functions', function(){
  it('should have a createUser function', function(){
    expect(typeof auth.createUser).to.equal('function');
  });

  it('should have a resetPassword function', function(){
    expect(typeof auth.resetPassword).to.equal('function');
  });

    it('should have a checkAuth function', function(){
    expect(typeof auth.checkAuth).to.equal('function');
  });
});
