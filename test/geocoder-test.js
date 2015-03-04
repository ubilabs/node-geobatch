/* eslint-disable no-unused-expressions, one-var, max-nested-callbacks */
require('traceur-runner');

const should = require('should'),
  promised = require('should-promised'),
  fs = require('fs'),
  flatfile = require('flat-file-db'),
  Geocoder = require('../src/geocoder.js');

/* eslint-disable no-console */
console.log(promised);
/* eslint-enable no-console */

describe('Testing geocoder', function() {
  afterEach(function(done) {
    fs.exists('geocache.db', function(exists) {
      if (exists) {
        fs.unlinkSync('geocache.db');
      }

      done();
    });
  });

  it('should create a new instance when called without params', function() {
    const geocoder = new Geocoder();

    should.exist(geocoder);
  });

  it('should accept a client ID and a private key', function() {
    const geocoder = new Geocoder({
      clientId: 'dummy',
      privateKey: 'dummy'
    });

    should.exist(geocoder);
  });

  it('should throw an error when there is only the client id', function() {
    should(function() {
      this.geocoder = new Geocoder({
        clientId: 'dummy'
      });
    }).throw('Missing privateKey');
  });

  it('should throw an error when there is only the private key', function() {
    should(function() {
      this.geocoder = new Geocoder({
        privateKey: 'dummy'
      });
    }).throw('Missing clientId');
  });

  it('should return a promise from the geocodeAddress function', function() {
    const geocoder = new Geocoder();

    geocoder.geocodeAddress('Hamburg').should.be.a.Promise;
  });

  it('should reject when geocoding with false id or key', function() {
    const geocoder = new Geocoder({
        clientId: 'dummy',
        privateKey: 'dummy'
      }),
      address = 'Juliusstraße 25, 22769 Hamburg';

    geocoder.geocodeAddress(address)
      .should.be.rejectedWith('Wrong clientId or privateKey');
  });

  it('should geocode an address', function(done) {
    const geocoder = new Geocoder(),
      address = 'Juliusstraße 25, 22769 Hamburg';

    geocoder.geocodeAddress(address).then(function(location) {
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
      address = 'Hamburg',
      geocode = geocoder.geocodeAddress(address);

    geocode.then(function() {
      const cacheFileContent = fs.readFileSync('geocache.db', {
        encoding: 'utf8'
      });

      setTimeout(() => {
        should(cacheFileContent).match(/"Hamburg"/);
        done();
      }, 200);
    });
  });

  it('should use the cached version if it exists', function(done) {
    const db = flatfile.sync('geocache.db'),
      dummyAddress = 'Dummy',
      dummyLocation = {
        lat: 1,
        lng: 2
      };

    db.put(dummyAddress, dummyLocation, () => {
      const geocoder = new Geocoder();

      geocoder.geocodeAddress(dummyAddress).then(function(location) {
        should.deepEqual(dummyLocation, location);
        db.close();
        done();
      });
    });
  });
});
