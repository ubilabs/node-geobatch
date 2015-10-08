/* eslint-disable no-unused-expressions, one-var, max-nested-callbacks */
import should from 'should';
import Geocoder from '../src/geocoder.js';
import assert from 'assert';
import sinon from 'sinon';

assert.called = sinon.assert.called;
assert.calledWith = sinon.assert.calledWith;

class MockCache {
  constructor() {}
  get() {}
  add() {}
}

/**
 * Returns a geocode function to be used in the geocoder.
 * @param  {Object} status The status of the geocode repsonse
 * @param  {Object} results The results of the geocode response
 * @param  {Object} error  The error message of the geocode response
 * @return {Function}         A stubbed function that calls the second argument
 *                              as a callback.
 */
function getGeocodeFunction({status = '', results = '', error = ''}) {
  const geoCoderReponseObject = {
    status,
    results
  };
  return sinon.stub()
    .callsArgWith(1, error, geoCoderReponseObject);
}

/**
 * Returns a geocoder interface. The init function returns a geocoder that
 * exposes a geocode function.
 * @param  {Function} geocodeFunction The geocode function to be exposed.
 * @return {Object}                 A geocoder interface object.
 */
function getGeocoder(geocodeFunction) {
  let geoCoderInterface = {init: () => {}};

  if (geocodeFunction) {
    geoCoderInterface.init = () => {
      return {
        geocode: geocodeFunction
      };
    };
  }
  return geoCoderInterface;
}

describe('Testing geocoder', function() {
  it('should create a new instance when called without options', function() {
    const geocoder = new Geocoder(
      {},
      getGeocoder(),
      MockCache
    );

    should.exist(geocoder);
  });

  it('should accept a client ID and a private key', function() {
    const geocoder = new Geocoder(
      {clientId: 'dummy', privateKey: 'dummy'},
      getGeocoder(),
      MockCache
    );

    should.exist(geocoder);
  });

  it('should throw an error when there is only the client id', function() {
    should(() => {
      const geocoder = new Geocoder( // eslint-disable-line
        {clientId: 'dummy'},
        getGeocoder(),
        MockCache
      );
    }).throw('Missing privateKey');
  });

  it('should throw an error when there is only the private key', function() {
    should(function() {
      const geocoder = new Geocoder(// eslint-disable-line
        {privateKey: 'dummy'},
        getGeocoder(),
        MockCache
      );
    }).throw('Missing clientId');
  });

  it('should return a promise from the geocodeAddress function', () => {
    const geocodeFunction = getGeocodeFunction({error: 'error'});

    const geoCoderInterface = getGeocoder(geocodeFunction),
      geocoder = new Geocoder(
        {},
        geoCoderInterface,
        MockCache
      );

    geocoder.geocodeAddress('Hamburg').should.be.a.Promise;
  });

  it('should call geocode function on geocodeAddress with correct parameter',
    function(done) {
      const mockAddress = 'anAddress',
        geocodeFunction = getGeocodeFunction({results: ['some result']}),
        geoCoderInterface = getGeocoder(geocodeFunction),
        geocoder = new Geocoder(
          {
            clientId: 'dummy',
            privateKey: 'dummy'
          },
          geoCoderInterface,
          MockCache
        );

      geocoder.geocodeAddress(mockAddress)
        .then(() => {
          assert.calledWith(geocodeFunction, mockAddress);
          done();
        })
        .catch(error => {
          done(error);
        });
    }
  );

  it('should throw error when geocoder returns error', function(done) {
    const mockAddress = 'Hamburg',
      geocodeFunction = getGeocodeFunction({error: 'error'}),
      geoCoderInterface = getGeocoder(geocodeFunction),
      geocoder = new Geocoder(
        {
          clientId: 'dummy',
          privateKey: 'dummy'
        },
        geoCoderInterface,
        MockCache);

    geocoder.geocodeAddress(mockAddress)
      .catch(error => {
        should(error).be.an.Error;
        should(error.message).equal('Wrong clientId or privateKey');
        done();
      })
      .catch(error => {
        done(error);
      });
  });

  it('should geocode an address', function(done) {
    const mockAddress = 'Hamburg',
      geoCoderResult = ['mockResult'],
      geocodeFunction = getGeocodeFunction({results: geoCoderResult}),
      geoCoderInterface = getGeocoder(geocodeFunction),
      geocoder = new Geocoder(
        {},
        geoCoderInterface,
        MockCache
      );

    geocoder.geocodeAddress(mockAddress)
      .then(function(result) {
        assert.equal(geoCoderResult, result);
        done();
      })
      .catch(error => {
        done(error);
      });
  });

  it('should cache a geocode', function(done) {
    const mockAddress = 'anAddress',
      geoCoderResult = ['mockResult'],
      geocodeFunction = getGeocodeFunction({results: geoCoderResult}),
      geoCoderInterface = getGeocoder(geocodeFunction),
      addFunction = sinon.stub();

    class NewMockCache extends MockCache {
      add(key, value) {
        addFunction(key, value);
      }
    }

    const geocoder = new Geocoder(
        {},
        geoCoderInterface,
        NewMockCache
      ),
      geocode = geocoder.geocodeAddress(mockAddress);

    geocode
      .then(function() {
        assert.calledWith(addFunction, mockAddress, geoCoderResult[0]);
        done();
      })
      .catch(error => {
        done(error);
      });
  });

  it('should use the cached version if it exists', function(done) {
    const mockAddress = 'anAddress',
      cachedResult = 'a result from the cache',
      geoCoderResult = ['mockResult'],
      geocodeFunction = getGeocodeFunction({results: geoCoderResult}),
      geoCoderInterface = getGeocoder(geocodeFunction);

    class NewMockCache extends MockCache {
      get() {
        return cachedResult;
      }
    }

    const geocoder = new Geocoder(
        {},
        geoCoderInterface,
        NewMockCache
      ),
      geocode = geocoder.geocodeAddress(mockAddress);

    geocode
      .then(result => {
        assert.equal(result, cachedResult);
        done();
      })
      .catch(error => {
        done(error);
      });
  });

  it('should return an error when no result is found', function(done) {
    const mockAddress = 'My dummy location that does not exist!',
      geocodeFunction = getGeocodeFunction({results: []}),
      geoCoderInterface = getGeocoder(geocodeFunction),
      geocoder = new Geocoder(
        {},
        geoCoderInterface,
        MockCache
      );

    geocoder.geocodeAddress(mockAddress).catch(error => {
      should(error).be.an.Error;
      should(error.message).equal('No results found');
      done();
    });
  });
});
