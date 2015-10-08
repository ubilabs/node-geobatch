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

let GeocoderMockInterface;

describe('Testing geocoder', function() {
  beforeEach(() => {
    GeocoderMockInterface = {init: () => {}};
  });

  it('should create a new instance when called without options', function() {
    const geocoder = new Geocoder(
      {},
      GeocoderMockInterface,
      MockCache
    );

    should.exist(geocoder);
  });

  it('should accept a client ID and a private key', function() {
    const geocoder = new Geocoder(
      {clientId: 'dummy', privateKey: 'dummy'},
      GeocoderMockInterface,
      MockCache
    );

    should.exist(geocoder);
  });

  it('should throw an error when there is only the client id', function() {
    should(() => {
      const geocoder = new Geocoder( // eslint-disable-line
        {clientId: 'dummy'},
        GeocoderMockInterface,
        MockCache
      );
    }).throw('Missing privateKey');
  });

  it('should throw an error when there is only the private key', function() {
    should(function() {
      const geocoder = new Geocoder(// eslint-disable-line
        {privateKey: 'dummy'},
        GeocoderMockInterface,
        MockCache
      );
    }).throw('Missing clientId');
  });

  it('should return a promise from the geocodeAddress function', (done) => {
    GeocoderMockInterface.init = sinon.stub().returns({
      geocode: (address, cab) => {
        cab('error');
        done();
      }
    });

    const geocoder = new Geocoder(
      {},
      GeocoderMockInterface,
      MockCache
    );

    geocoder.geocodeAddress('Hamburg').should.be.a.Promise;
  });

  it('should call geocode function on geocodeAddress with correct parameter',
    function(done) {
      const mockAddress = 'anAddress',
        geoCoderErrorReponse = '',
        geoCoderReponseObject = {
          status: '',
          results: [1]
        },
        geocodeFunction = sinon.stub()
          .callsArgWith(1, geoCoderErrorReponse, geoCoderReponseObject);

      GeocoderMockInterface.init = () => {
        return {
          geocode: geocodeFunction
        };
      };

      const geocoder = new Geocoder(
        {
          clientId: 'dummy',
          privateKey: 'dummy'
        },
        GeocoderMockInterface,
        MockCache);

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

  // it('should reject when geocoding with false id or key', function(done) {
  it('should throw error when geocoder returns error', function(done) {
    // A geocoder that returns an error on geocode.
    const geoCoderErrorReponse = 'error',
      geocodeFunction = sinon.stub()
        .callsArgWith(1, geoCoderErrorReponse);

    GeocoderMockInterface.init = () => {
      return {
        geocode: geocodeFunction
      };
    };

    const geocoder = new Geocoder({
        clientId: 'dummy',
        privateKey: 'dummy'
      },
      GeocoderMockInterface,
      MockCache),
      address = 'Hamburg';

    geocoder.geocodeAddress(address).catch(error => {
      should(error).be.an.Error;
      should(error.message).equal('Wrong clientId or privateKey');
      done();
    });
  });

  it('should geocode an address', function(done) {
    const geoCoderErrorReponse = '',
      geoCoderResult = 'mockResult',
      geoCoderReponseObject = {
        status: '',
        results: [geoCoderResult]
      },
      geocodeFunction = sinon.stub()
        .callsArgWith(1, geoCoderErrorReponse, geoCoderReponseObject);

    GeocoderMockInterface.init = () => {
      return {
        geocode: geocodeFunction
      };
    };

    const geocoder = new Geocoder(
      {},
      GeocoderMockInterface,
      MockCache
    ),
      address = 'Hamburg';

    geocoder.geocodeAddress(address)
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
      geoCoderErrorReponse = '',
      geoCoderResult = 'mockResult',
      geoCoderReponseObject = {
        status: '',
        results: [geoCoderResult]
      },
      geocodeFunction = sinon.stub()
        .callsArgWith(1, geoCoderErrorReponse, geoCoderReponseObject);

    GeocoderMockInterface.init = () => {
      return {
        geocode: geocodeFunction
      };
    };

    const addFunction = sinon.stub();
    class MockCache2 extends MockCache {
      add(key, value) {
        addFunction(key, value);
      }
    }

    const geocoder = new Geocoder(
        {},
        GeocoderMockInterface,
        MockCache2
      ),
      geocode = geocoder.geocodeAddress(mockAddress);

    geocode
      .then(function() {
        assert.calledWith(addFunction, mockAddress, geoCoderResult);
        done();
      })
      .catch(error => {
        done(error);
      });
  });

  it('should use the cached version if it exists', function(done) {
    const mockAddress = 'anAddress',
      geoCoderErrorReponse = '',
      geoCoderResult = 'mockResult',
      cachedResult = 'a result from the cache',
      geoCoderReponseObject = {
        status: '',
        results: [geoCoderResult]
      },
      geocodeFunction = sinon.stub()
        .callsArgWith(1, geoCoderErrorReponse, geoCoderReponseObject);

    GeocoderMockInterface.init = () => {
      return {
        geocode: geocodeFunction
      };
    };

    class MockCache2 extends MockCache {
      get() {
        return cachedResult;
      }
    }

    const geocoder = new Geocoder(
        {},
        GeocoderMockInterface,
        MockCache2
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
    const geoCoderErrorReponse = '',
      geoCoderReponseObject = {
        status: '',
        results: []
      },
      geocodeFunction = sinon.stub()
        .callsArgWith(1, geoCoderErrorReponse, geoCoderReponseObject);

    GeocoderMockInterface.init = () => {
      return {
        geocode: geocodeFunction
      };
    };

    const geocoder = new Geocoder(
        {},
        GeocoderMockInterface,
        MockCache
      ),
      address = 'My dummy location that does not exist!';

    geocoder.geocodeAddress(address).catch(error => {
      should(error).be.an.Error;
      should(error.message).equal('No results found');
      done();
    });
  });
});
