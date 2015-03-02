require('traceur-runner');

var should = require('should'),
  GeoBatch = require('../src/index.js');

describe('Testing index', function() {
  it('should create a new instance when called without params', function() {
    var geoBatch = new GeoBatch();

    should.exist(geoBatch);
  });
});
