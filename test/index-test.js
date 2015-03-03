/* eslint-disable no-unused-expressions */
require('traceur-runner');

var should = require('should'),
  fs = require('fs'),
  GeoBatch = require('../src/index.js');

describe('Testing index', function() {
  afterEach(function(done) {
    fs.exists('geocache.db', function(exists) {
      if (exists) {
        fs.unlinkSync('geocache.db');
      }

      done();
    });
  });

  it('should create a new instance when called without params', function() {
    var geoBatch = new GeoBatch();

    should.exist(geoBatch);
  });

  it('should accept a cachefile name', function(done) {
    var geoBatch = new GeoBatch({
      cacheFile: 'myPersonalGeocache.db'
    });

    should.exist(geoBatch);

    fs.exists('myPersonalGeocache.db', function(exists) {
      should(exists).be.true;
      fs.unlinkSync('myPersonalGeocache.db');
      done();
    });
  });
});
