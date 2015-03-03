/* eslint-disable no-unused-expressions */
require('traceur-runner');

var should = require('should'),
  fs = require('fs'),
  Cache = require('../src/cache.js');

describe('Testing cache', function() {
  afterEach(function(done) {
    fs.exists('geocache.db', function(exists) {
      if (exists) {
        fs.unlinkSync('geocache.db');
      }

      done();
    });
  });

  it('should create a new instance when called without params', function() {
    var cache = new Cache();

    should.exist(cache);
  });

  it('should create a new cache file when not existing', function(done) {
    this.cache = new Cache();

    fs.exists('geocache.db', function(exists) {
      should(exists).be.true;
      done();
    });
  });

  it('should create a new cache file depending on the name', function(done) {
    this.cache = new Cache('myPersonalGeocache.db');

    fs.exists('myPersonalGeocache.db', function(exists) {
      should(exists).be.true;
      fs.unlinkSync('myPersonalGeocache.db');
      done();
    });
  });
});
