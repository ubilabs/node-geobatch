/* eslint-disable no-unused-expressions, max-nested-callbacks,
  no-underscore-dangle */
import sinon from 'sinon';
import should from 'should';
import stream from 'stream';
import intoStream from 'into-stream';
import streamAssert from 'stream-assert';
import Promise from 'lie';

import GeocodeStream from '../src/geocode-stream';
import {getGeocodeStream, getGeocoderInterface} from './lib/helpers';

describe('Geocode Stream', () => {
  it('be of type stream.Transform', () => {
    const geocodeStream = new GeocodeStream();
    should(geocodeStream).be.an.instanceof(stream.Transform);
  });

  it('have a _transform function', () => {
    const geocodeStream = new GeocodeStream();
    should(geocodeStream._transform).be.a.Function;
  });

  it('should take a geocoder', () => {
    const mockGeocoder = 'a geocoder',
      geocodeStream = new GeocodeStream(mockGeocoder);
    should(geocodeStream.geocoder).be.equal(mockGeocoder);
  });

  it('should take stats', () => {
    const mockStats = 'some stats',
      geocodeStream = new GeocodeStream(null, mockStats);
    should(geocodeStream.stats).be.equal(mockStats);
  });

  it('should take an accessor function', function() {
    const mockAcessor = sinon.stub(),
      geocodeStream = new GeocodeStream(null, null, mockAcessor);

    should(geocodeStream.accessor).equal(mockAcessor);
  });

  describe('_transform should', () => {
    it('send an address to the geocoder', done => {
      const promise = Promise.resolve(),
        newGeocodeAddressFunction = sinon.stub().returns(promise),
        GeoCoderInterface = getGeocoderInterface(
          null,
          newGeocodeAddressFunction
        ),
        geocoder = GeoCoderInterface.init(),
        geocodeStream = new GeocodeStream(geocoder);

      geocodeStream._transform('test', null, null);
      promise
        .then(() => {
          sinon.assert.calledWith(newGeocodeAddressFunction, 'test');
        })
        .then(done, done);
    });

    it('call the \'done\' function when finishes succesfully', done => {
      const promise = Promise.resolve([{geometry: {location: null}}]),
        geocodeStream = getGeocodeStream(promise);

      const doneFunction = sinon.stub();

      geocodeStream._transform('test2', null, doneFunction);

      promise
        .then(() => {
          sinon.assert.called(doneFunction);
        })
        .then(done, done);
    });

    it('call the \'done\' function when finishes with error', done => {
      const promise = Promise.reject(new Error('error')),
        geocodeStream = getGeocodeStream(promise),
        mockInput = 'some input',
        doneFunction = sinon.stub();

      geocodeStream._transform(mockInput, null, doneFunction);

      promise
        .catch(() => {
          sinon.assert.called(doneFunction);
        })
        .then(done, done);
    });

    it('apply accessor before passing the address to the geocoder', done => {
      const mockAddress = 'an address',
        mockInput = {address: mockAddress},
        accessorFunction = item => item.address,
        promise = Promise.resolve(),
        newGeocodeAddressFunction = sinon.stub().returns(promise),
        GeoCoderInterface = getGeocoderInterface(
          null,
          newGeocodeAddressFunction
        ),
        geocoder = GeoCoderInterface.init(),
        geocodeStream = new GeocodeStream(geocoder, null, accessorFunction);

      geocodeStream._transform(mockInput, null, null);
      promise
        .then(() => {
          sinon.assert.calledWith(newGeocodeAddressFunction, mockAddress);
        })
        .then(done, done);
    });
  });

  describe('(on succesful geocode)', () => {
    it('add input result', done => {
      const mockInput = 'mockInput',
        mockStream = intoStream.obj([mockInput]),
        mockGeocoderResult = {
          geometry: {location: 2}
        },
        promise = Promise.resolve(mockGeocoderResult),
        geocodeStream = getGeocodeStream(promise);

      mockStream
        .pipe(geocodeStream)
        .pipe(streamAssert.first(item => {
          should(item.input).equal(mockInput);
        }))
        .pipe(streamAssert.end(error => {
          done(error);
        }));
    });

    it('add input address to result,', done => {
      const mockAccessor = input => input.address,
        mockAddress = 'mockAddress',
        mockInput = {address: mockAddress},
        mockStream = intoStream.obj([mockInput]),
        mockGeocoderResult = {
          geometry: {location: 2}
        },
        promise = Promise.resolve(mockGeocoderResult),
        geocodeStream = getGeocodeStream(promise);

      geocodeStream.accessor = mockAccessor;

      mockStream
        .pipe(geocodeStream)
        .pipe(streamAssert.first(item => {
          should(item.address).equal(mockAddress);
        }))
        .pipe(streamAssert.end(error => {
          done(error);
        }));
    });

    it('add first geocoder result to result field', done => {
      const mockStream = intoStream.obj(['mockAddress']),
        mockGeocoderResult = [{
          geometry: {location: 2}
        }],
        expectedResult = mockGeocoderResult[0],
        promise = Promise.resolve(mockGeocoderResult),
        geocodeStream = getGeocodeStream(promise);

      mockStream
        .pipe(geocodeStream)
        .pipe(streamAssert.first(item => {
          should(item.result).equal(expectedResult);
        }))
        .pipe(streamAssert.end(error => {
          done(error);
        }));
    });

    it('add all geocoder results to results field', done => {
      const mockStream = intoStream.obj(['mockAddress']),
        mockGeocoderResult = [{
          geometry: {location: 2}
        }],
        expectedResult = mockGeocoderResult,
        promise = Promise.resolve(mockGeocoderResult),
        geocodeStream = getGeocodeStream(promise);

      mockStream
        .pipe(geocodeStream)
        .pipe(streamAssert.first(item => {
          should(item.results).equal(expectedResult);
        }))
        .pipe(streamAssert.end(error => {
          done(error);
        }));
    });

    it('add geocoder result location to result', done => {
      const mockStream = intoStream.obj(['mockAddress']),
        mockGeocoderResult = [{
          geometry: {location: 2}
        }],
        expectedLocation = mockGeocoderResult[0].geometry.location,
        promise = Promise.resolve(mockGeocoderResult),
        geocodeStream = getGeocodeStream(promise);

      mockStream
        .pipe(geocodeStream)
        .pipe(streamAssert.first(item => {
          should(item.location).equal(expectedLocation);
        }))
        .pipe(streamAssert.end(error => {
          done(error);
        }));
    });

    it('set error to null', done => {
      const mockStream = intoStream.obj(['mockAddress']),
        mockGeocoderResult = [{
          geometry: {location: 2}
        }],
        promise = Promise.resolve(mockGeocoderResult),
        geocodeStream = getGeocodeStream(promise),
        expectedErrorMessage = null;

      mockStream
        .pipe(geocodeStream)
        .pipe(streamAssert.first(item => {
          should(item.error).equal(expectedErrorMessage);
        }))
        .pipe(streamAssert.end(error => {
          done(error);
        }));
    });

    it('add stats fields to result when stats are delivered', done => {
      const mockStream = intoStream.obj(['mockAddress']),
        mockGeocoderResult = [{
          geometry: {location: 2}
        }],
        promise = Promise.resolve(mockGeocoderResult),
        geocodeStream = getGeocodeStream(promise);

      geocodeStream.stats = {
        total: 0,
        current: 0,
        startTime: new Date()
      };

      mockStream
        .pipe(geocodeStream)
        .pipe(streamAssert.first(item => {
          should(item).have
            .properties(['total', 'current', 'pending', 'percent']);
        }))
        .pipe(streamAssert.end(error => {
          done(error);
        }));
    });

    it('add stats fields to result when stats are not given', done => {
      const mockStream = intoStream.obj(['mockAddress']),
        mockGeocoderResult = {
          geometry: {location: 2}
        },
        promise = Promise.resolve(mockGeocoderResult),
        geocodeStream = getGeocodeStream(promise);

      mockStream
        .pipe(geocodeStream)
        .pipe(streamAssert.first(item => {
          should(item).have
            .properties(['current']);
          should(item).not.have
            .properties(['total', 'pending', 'percent']);
        }))
        .pipe(streamAssert.end(error => {
          done(error);
        }));
    });
  });

  describe('(on unsuccesful geocode)', () => {
    it('add input address to result', done => {
      const mockAddress = 'mockAddress',
        mockStream = intoStream.obj([mockAddress]),
        promise = Promise.reject(new Error()),
        geocodeStream = getGeocodeStream(promise);

      mockStream
        .pipe(geocodeStream)
        .pipe(streamAssert.first(item => {
          should(item.address).equal(mockAddress);
        }))
        .pipe(streamAssert.end(error => {
          done(error);
        }));
    });

    it('add empty object to result', done => {
      const mockStream = intoStream.obj(['mockAddress']),
        promise = Promise.reject(new Error()),
        geocodeStream = getGeocodeStream(promise),
        expectedResult = {};

      mockStream
        .pipe(geocodeStream)
        .pipe(streamAssert.first(item => {
          should(item.result).deepEqual(expectedResult);
        }))
        .pipe(streamAssert.end(error => {
          done(error);
        }));
    });

    it('add empty location to result', done => {
      const mockStream = intoStream.obj(['mockAddress']),
        promise = Promise.reject(new Error()),
        geocodeStream = getGeocodeStream(promise),
        expectedLocation = {};

      mockStream
        .pipe(geocodeStream)
        .pipe(streamAssert.first(item => {
          should(item.location).deepEqual(expectedLocation);
        }))
        .pipe(streamAssert.end(error => {
          done(error);
        }));
    });

    it('add error message on geocoder error', done => {
      const mockStream = intoStream.obj(['mockAddress']),
        mockErrorMessage = 'an error message',
        mockError = new Error(mockErrorMessage),
        promise = Promise.reject(mockError),
        geocodeStream = getGeocodeStream(promise);

      mockStream
        .pipe(geocodeStream)
        .pipe(streamAssert.first(item => {
          should(item.error).equal(mockErrorMessage);
        }))
        .pipe(streamAssert.end(error => {
          done(error);
        }));
    });

    it('add stats fields to result if stats are given', done => {
      const mockStream = intoStream.obj(['mockAddress']),
        mockGeocoderResult = {
          geometry: {location: 2}
        },
        promise = Promise.resolve(mockGeocoderResult),
        geocodeStream = getGeocodeStream(promise);

      geocodeStream.stats = {
        total: 0,
        current: 0,
        startTime: new Date()
      };

      mockStream
        .pipe(geocodeStream)
        .pipe(streamAssert.first(item => {
          should(item).have
            .properties(['total', 'current', 'pending', 'percent']);
        }))
        .pipe(streamAssert.end(error => {
          done(error);
        }));
    });

    it('add some stats fields to result if stats are not given', done => {
      const mockStream = intoStream.obj(['mockAddress']),
        mockGeocoderResult = {
          geometry: {location: 2}
        },
        promise = Promise.resolve(mockGeocoderResult),
        geocodeStream = getGeocodeStream(promise);

      mockStream
        .pipe(geocodeStream)
        .pipe(streamAssert.first(item => {
          should(item).have
            .properties(['current']);
          should(item).not.have
            .properties(['total', 'pending', 'percent']);
        }))
        .pipe(streamAssert.end(error => {
          done(error);
        }));
    });
  });
});
/* eslint-enable */
