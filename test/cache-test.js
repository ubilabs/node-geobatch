/* eslint-disable no-unused-expressions */
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
    const cache = new Cache();

    should.exist(cache);
  });

  it('should create a new cache file when not existing', function(done) {
    const cache = new Cache(); // eslint-disable-line

    fs.exists('geocache.db', function(exists) {
      should(exists).be.true;
      done();
    });
  });

  it('should create a new cache file depending on the name', function(done) {
    const cache = new Cache('myPersonalGeocache.db'); // eslint-disable-line

    fs.exists('myPersonalGeocache.db', function(exists) {
      should(exists).be.true;
      fs.unlinkSync('myPersonalGeocache.db');
      done();
    });
  });

  it('should be possible to add and retrieve new entries', function(done) {
    const cache = new Cache();

    cache.add('MyLocation', {lat: 50, lng: 10}, function() {
      should.exist(cache.get('MyLocation'));
      should.deepEqual(cache.get('MyLocation'), {lat: 50, lng: 10});
      done();
    });
  });

  it('should return nothing when entry not exists', function() {
    const cache = new Cache();

    should.not.exist(cache.get('MyLocation'));
  });
});
