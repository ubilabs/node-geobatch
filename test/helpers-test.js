/* eslint-disable no-unused-expressions */
import assert from 'assert';
import sinon from 'sinon';
import should from 'should';
import {getGeocodeFunction, getGeocoderInterface} from './lib/helpers';

assert.called = sinon.assert.called;
assert.calledWith = sinon.assert.calledWith;

describe('Helper functions ', () => {
  describe('getGeocoderInterface', () => {
    it('should return a geocoder interface', () => {
      const geocoderInterface = getGeocoderInterface();

      assert.equal(typeof geocoderInterface.init, 'function');
    });

    it(`should return a geocoder interface which returna geocoder with
      a given geocode function`, () => {
        const mockGeocodeFunction = () => {},
          geocoderInterface = getGeocoderInterface(mockGeocodeFunction),
          geocoder = geocoderInterface.init(),
          geocodeFunction = geocoder.geocode;
        assert.deepEqual(geocodeFunction, mockGeocodeFunction);
      }
    );

    it(`should return a geocoder interface which return a geocoder with
      a given geocodeAddress function`, () => {
        const mockGeocodeAddressFunction = () => {},
          geocoderInterface = getGeocoderInterface(
            null,
            mockGeocodeAddressFunction
          ),
          geocoder = geocoderInterface.init(),
          geocodeAddressFunction = geocoder.geocodeAddress;
        assert.deepEqual(geocodeAddressFunction, mockGeocodeAddressFunction);
      }
    );
  });

  describe('getGeocodeFunction', () => {
    it('should return a default geocode function', () => {
      const mockGeocodeFunction = getGeocodeFunction();

      should(mockGeocodeFunction).be.a.Function;
    });

    it('should call callback', () => {
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
/* eslint-enable */
