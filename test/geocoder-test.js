/* eslint-disable no-unused-expressions */
require('traceur-runner');

const should = require('should'),
  Cache = require('../src/cache.js'),
  Geocoder = require('../src/geocoder.js');

describe('Testing geocoder', function() {
  it('should create a new instance when called without params', function() {
    const geocoder = new Geocoder();

    should.exist(geocoder);
  });

  it('should geocode an address', function(done) {
    const geocoder = new Geocoder(),
      address = 'Juliusstraße 25, 22769 Hamburg',
      geocode = geocoder.geocodeAddress(address);

    should(geocode).be.fulfilled;

    geocode.then(function(location) {
      should(location).be.an.object;
      should(location).have.keys('lat', 'lng');
      should(location.lat).be.above(53);
      should(location.lat).be.below(54);
      should(location.lng).be.above(9);
      should(location.lng).be.below(10);
      done();
    });
  });

  it('should cache a geocode', function(done) {
    const geocoder = new Geocoder(),
      cache = new Cache(),
      address = 'Juliusstraße 25, 22769 Hamburg',
      geocode = geocoder.geocodeAddress(address);

    geocode.then(function(location) {
      should.exist(cache.get(address));
      should.deepEqual(cache.get(address), location);
      done();
    });
  });
});
