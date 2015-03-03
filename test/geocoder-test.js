/* eslint-disable no-unused-expressions */
require('traceur-runner');

var should = require('should'),
  Geocoder = require('../src/geocoder.js');

describe('Testing geocoder', function() {
  it('should create a new instance when called without params', function() {
    var geocoder = new Geocoder();

    should.exist(geocoder);
  });

  it('should geocode an address', function(done) {
    var geocoder = new Geocoder(),
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
});
