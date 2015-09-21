var handler = require('../server/helpers.js');
var expect = require('../node_modules/chai/chai').expect;
var server = require('../server/server.js').server;

console.log('handler',handler);

console.log('describe', describe);

describe('handler function', function(){
  it('should have a signin function', function(){
    expect(typeof handler.signin).to.equal('function');
  });

  it('should have a verify function', function(){
    expect(typeof handler.verify).to.equal('function');
  });

})
