/* eslint-disable no-unused-expressions, one-var, max-nested-callbacks */
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
      const geocoder = new Geocoder({ // eslint-disable-line
        clientId: 'dummy'
      });
    }).throw('Missing privateKey');
  });

  it('should throw an error when there is only the private key', function() {
    should(function() {
      const geocoder = new Geocoder({ // eslint-disable-line
        privateKey: 'dummy'
      });
    }).throw('Missing clientId');
  });

  it('should return a promise from the geocodeAddress function', function() {
    const geocoder = new Geocoder();

    geocoder.geocodeAddress('Hamburg').should.be.a.Promise;
  });

  it('should reject when geocoding with false id or key', function(done) {
    const geocoder = new Geocoder({
        clientId: 'dummy',
        privateKey: 'dummy'
      }),
      address = 'Hamburg';

    geocoder.geocodeAddress(address).catch(error => {
      should(error).be.an.Error;
      should(error.message).equal('Wrong clientId or privateKey');
      done();
    });
  });

  it('should geocode an address', function(done) {
    const geocoder = new Geocoder(),
      address = 'Hamburg';

    geocoder.geocodeAddress(address).then(function(result) {
      should(result.address_components).be.an.Array;
      should(result.formatted_address).be.a.String;
      should(result.geometry.location).be.an.object;
      should(result.geometry.location).have.keys('lat', 'lng');
      should(result.geometry.location.lat).be.above(53);
      should(result.geometry.location.lat).be.below(54);
      should(result.geometry.location.lng).be.above(9);
      should(result.geometry.location.lng).be.below(10);
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

      geocoder.geocodeAddress(dummyAddress).then(function(result) {
        should.deepEqual(dummyLocation, result);
        db.close();
        done();
      });
    });
  });

  it('should return an error when no result is found', function(done) {
    const geocoder = new Geocoder(),
      address = 'My dummy location that does not exist!';

    geocoder.geocodeAddress(address).catch(error => {
      should(error).be.an.Error;
      should(error.message).equal('No results found');
      done();
    });
  });
});
