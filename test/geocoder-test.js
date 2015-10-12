/* eslint-disable no-unused-expressions, one-var, max-nested-callbacks */
import should from 'should';
import Geocoder from '../src/geocoder.js';
import assert from 'assert';
import sinon from 'sinon';
import {getGeocodeFunction, getGeocoderInterface} from './lib/helpers';

assert.called = sinon.assert.called;
assert.calledWith = sinon.assert.calledWith;

class MockCache {
  constructor() {}
  get() {}
  add() {}
}

describe('Testing geocoder', function() {
  it('should create a new instance when called without options', function() {
    const geocoder = new Geocoder(
      {},
      getGeocoderInterface(),
      MockCache
    );

    should.exist(geocoder);
  });

  it('should create a cache', function() {
    const mackCacheFileName = 'a file name',
      mockCacheConstructor = sinon.stub();

    class NewMockCache extends MockCache {
      constructor(fileName) {
        super();
        mockCacheConstructor(fileName);
      }
    }

    const geocoder = new Geocoder( // eslint-disable-line
      {cacheFile: mackCacheFileName},
      getGeocoderInterface(),
      NewMockCache
    );

    assert.calledWith(mockCacheConstructor, mackCacheFileName);
  });

  it('should accept a client ID and a private key', function() {
    const geocoder = new Geocoder(
      {clientId: 'dummy', privateKey: 'dummy'},
      getGeocoderInterface(),
      MockCache
    );

    should.exist(geocoder);
  });

  it('should throw an error when there is only the client id', function() {
    should(() => {
      const geocoder = new Geocoder( // eslint-disable-line
        {clientId: 'dummy'},
        getGeocoderInterface(),
        MockCache
      );
    }).throw('Missing privateKey');
  });

  it('should throw an error when there is only the private key', function() {
    should(function() {
      const geocoder = new Geocoder(// eslint-disable-line
        {privateKey: 'dummy'},
        getGeocoderInterface(),
        MockCache
      );
    }).throw('Missing clientId');
  });

  it('should return a promise from the geocodeAddress function', () => {
    const geocodeFunction = getGeocodeFunction({error: 'error'});

    const geoCoderInterface = getGeocoderInterface(geocodeFunction),
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
        geoCoderInterface = getGeocoderInterface(geocodeFunction),
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
      geoCoderInterface = getGeocoderInterface(geocodeFunction),
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
      geoCoderInterface = getGeocoderInterface(geocodeFunction),
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
      geoCoderInterface = getGeocoderInterface(geocodeFunction),
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
      geoCoderInterface = getGeocoderInterface(geocodeFunction);

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
      geoCoderInterface = getGeocoderInterface(geocodeFunction),
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
