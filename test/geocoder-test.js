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
function getGeocodeFunction(
  {status = '', results = '', error = ''}
    = {status: '', results: '', error: ''}) {
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

describe('Helper functions ', () => {
  describe('getGeocoder', () => {
    it('should return a geocoder interface', () => {
      const geocoderInterface = getGeocoder();

      assert.equal(typeof geocoderInterface.init, 'function');
    });

    it(`should return a geocoder interface which returna geocoder with
      a given geocode function`, () => {
        const mockGeocodeFunction = () => {},
          geocoderInterface = getGeocoder(mockGeocodeFunction),
          geocoder = geocoderInterface.init(),
          geocodeFunction = geocoder.geocode;
        assert.deepEqual(geocodeFunction, mockGeocodeFunction);
      }
    );
  });

  describe('getGeocodeFunction', () => {
    it('should return a default geocode function', () => {
      const mockGeocodeFunction = getGeocodeFunction();

      assert.equal(typeof mockGeocodeFunction, 'function');
    });
    it('should cal callback', () => {
      const mockGeocodeFunction = getGeocodeFunction(),
        callBack = sinon.stub();

      mockGeocodeFunction(null, callBack);
      assert.called(callBack);
    });
    it('should take an error value', () => {
      const errorMessage = 'an Error',
        mockGeocodeFunction = getGeocodeFunction({error: errorMessage}),
        callBack = sinon.stub();

      mockGeocodeFunction(null, callBack);
      assert.calledWith(callBack, errorMessage);
    });
    it('should take a results object', () => {
      const mockResults = 'some results',
        mockGeocodeFunction = getGeocodeFunction({results: mockResults}),
        callBack = sinon.stub(),
        expectedArgument = {status: '', results: mockResults};

      mockGeocodeFunction(null, callBack);
      assert.calledWith(callBack, '', expectedArgument);
    });
    it('should take a status object', () => {
      const mockStatus = 'some status',
        mockGeocodeFunction = getGeocodeFunction({status: mockStatus}),
        callBack = sinon.stub(),
        expectedArgument = {results: '', status: mockStatus};

      mockGeocodeFunction(null, callBack);
      assert.calledWith(callBack, '', expectedArgument);
    });
  });
});

describe('Testing geocoder', function() {
  it('should create a new instance when called without options', function() {
    const geocoder = new Geocoder(
      {},
      getGeocoder(),
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
      getGeocoder(),
      NewMockCache
    );

    assert.calledWith(mockCacheConstructor, mackCacheFileName);
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
