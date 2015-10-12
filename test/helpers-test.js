/* eslint-disable no-unused-expressions */
import stream from 'stream';
import Promise from 'lie';

import should from 'should';
import sinon from 'sinon';

import {
  getGeocodeFunction,
  getGeocoderInterface,
  getGeocodeStream
} from './lib/helpers';

describe('Helper functions ', () => {
  describe('getGeocoderInterface', () => {
    it('should return a geocoder interface', () => {
      const geocoderInterface = getGeocoderInterface();
      should(geocoderInterface.init).be.Function();
    });

    it(`should return a geocoder interface which returna geocoder with
      a given geocode function`, () => {
        const mockGeocodeFunction = () => {},
          geocoderInterface = getGeocoderInterface(mockGeocodeFunction),
          geocoder = geocoderInterface.init(),
          geocodeFunction = geocoder.geocode;
        should(geocodeFunction).deepEqual(mockGeocodeFunction);
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

        should(geocodeAddressFunction).deepEqual(mockGeocodeAddressFunction);
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
      sinon.assert.called(callBack);
    });

    it('should take an error value', () => {
      const errorMessage = 'an Error',
        mockGeocodeFunction = getGeocodeFunction({error: errorMessage}),
        callBack = sinon.stub();

      mockGeocodeFunction(null, callBack);
      sinon.assert.calledWith(callBack, errorMessage);
    });

    it('should take a results object', () => {
      const mockResults = 'some results',
        mockGeocodeFunction = getGeocodeFunction({results: mockResults}),
        callBack = sinon.stub(),
        expectedArgument = {status: '', results: mockResults};

      mockGeocodeFunction(null, callBack);
      sinon.assert.calledWith(callBack, '', expectedArgument);
    });

    it('should take a status object', () => {
      const mockStatus = 'some status',
        mockGeocodeFunction = getGeocodeFunction({status: mockStatus}),
        callBack = sinon.stub(),
        expectedArgument = {results: '', status: mockStatus};

      mockGeocodeFunction(null, callBack);
      sinon.assert.calledWith(callBack, '', expectedArgument);
    });
  });

  describe('getGeocodeStream', () => {
    it('should return a stream', () => {
      const mockPromise = Promise.resolve();
      const test = getGeocodeStream(mockPromise);
      should(test).be.instanceof(stream);
    });
  });
});
/* eslint-enable */
