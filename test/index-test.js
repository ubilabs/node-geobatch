/* eslint-disable no-unused-expressions, one-var */
import stream from 'stream';
import intoStream from 'into-stream';

import should from 'should';
import sinon from 'sinon';
import streamAssert from 'stream-assert';

import GeoBatch from '../src/index.js';
import {getGeocoderOptions} from './lib/helpers.js';
import ParallelTransform from '../src/lib/parallel-transform';

describe('Testing GeoBatch', () => {
  it('should accept a clientId and a privateKey', function() {
    /* eslint-disable no-unused-vars */
    const MockGeoCoder = sinon.stub(),
      expectedOptions = {
        cacheFile: 'geocache.db',
        clientId: null,
        privateKey: null,
        apiKey: null,
        queriesPerSecond: 50
      },
      options = {clientId: 'a clientID', privateKey: 'a privateKey'},
      geoBatch = new GeoBatch(options, MockGeoCoder);

    expectedOptions.clientId = 'a clientID';
    expectedOptions.privateKey = 'a privateKey';

    sinon.assert.calledWith(MockGeoCoder, expectedOptions);
  });

  it('should accept an apiKey', function() {
    /* eslint-disable no-unused-vars */
    const MockGeoCoder = sinon.stub(),
      expectedOptions = {
        cacheFile: 'geocache.db',
        clientId: null,
        privateKey: null,
        apiKey: null,
        queriesPerSecond: 50
      },
      options = {apiKey: 'an apiKey'},
      geoBatch = new GeoBatch(options, MockGeoCoder);

    expectedOptions.apiKey = 'an apiKey';

    sinon.assert.calledWith(MockGeoCoder, expectedOptions);
  });

  it('should accept a number of maximum queries per second', function() {
    /* eslint-disable no-unused-vars */
    const MockGeoCoder = sinon.stub(),
      expectedOptions = {
        cacheFile: 'geocache.db',
        clientId: null,
        privateKey: null,
        apiKey: null,
        queriesPerSecond: 25
      },
      options = getGeocoderOptions({queriesPerSecond: 25}),
      geoBatch = new GeoBatch(options, MockGeoCoder);

    expectedOptions.apiKey = options.apiKey;

    sinon.assert.calledWith(MockGeoCoder, expectedOptions);
  });

  it('should accept an accessor function', function() {
    /* eslint-disable no-unused-vars */
    const mockAccessor = sinon.stub(),
      geoBatch = new GeoBatch(getGeocoderOptions({
        accessor: mockAccessor
      }));

    should(geoBatch.accessor).be.equal(mockAccessor);
  });

  it('should have a geocode function that accepts and returns a stream',
    function(done) {
      const geoBatch = new GeoBatch(getGeocoderOptions());

      should(geoBatch.geocode).be.a.Function;

      geoBatch.geocode([])
        .on('data', function() {})
        .on('end', function() {
          done();
        });
    }
  );

  it('should call geocodeStream with correct stats when called with array',
    () => {
      const geoBatch = new GeoBatch(getGeocoderOptions()),
        geocodeStreamFunction = sinon.stub(),
        mockAddressArray = ['mock address'],
        expectedTotal = mockAddressArray.length,
        expectedCurrent = 0;
      geoBatch.geocodeStream = geocodeStreamFunction;

      geoBatch.geocode(mockAddressArray);
      const argumentsStats = geocodeStreamFunction.args[0][1];

      should(argumentsStats.total).equal(expectedTotal);
      should(argumentsStats.current).equal(expectedCurrent);
      should(argumentsStats.startTime).be.instanceof(Date);
    }
  );

  it('should transform an array to stream and pass it to geocodeStream', () => {
    const geoBatch = new GeoBatch(getGeocoderOptions()),
      geocodeStreamFunction = sinon.stub(),
      mockAddressArray = ['mock address'],
      expectedTotal = mockAddressArray.length,
      expectedCurrent = 0;
    geoBatch.geocodeStream = geocodeStreamFunction;

    geoBatch.geocode(mockAddressArray);
    const inputStream = geocodeStreamFunction.args[0][0];
    // Check for instance of stream.
    should(inputStream).be.instanceof(stream);

    // Check if first element of stream is equal to input.
    inputStream
      .pipe(streamAssert.first(mockAddressArray[0]));
  });

  it('should accept a stream into geocode and pass it on', () => {
    const geoBatch = new GeoBatch(getGeocoderOptions()),
      geocodeStreamFunction = sinon.stub(),
      mockInputStream = intoStream.obj(['mock address']);
    geoBatch.geocodeStream = geocodeStreamFunction;

    geoBatch.geocode(mockInputStream);
    sinon.assert.calledWith(geocodeStreamFunction, mockInputStream);
  });

  it('geocodeStream should pipe geocoder stream', done => {
    // Create a mock geocode-stream class that passes elements unchanged.
    class mockGeocodeStream extends stream.Transform {
      constructor() {
        super({objectMode: true});
      }
      _transform(item, encoding, done) { // eslint-disable-line
        this.push(item);
        done();
      }
    }
    const mockGeoCoder = sinon.stub(),
      geoBatch = new GeoBatch(getGeocoderOptions(),
        mockGeoCoder,
        mockGeocodeStream),
      mockAddress = 'some address',
      input = intoStream.obj([mockAddress]),
      resultStream = geoBatch.geocodeStream(input);

    resultStream
      .pipe(streamAssert.first(item => {
        should(item).equal(mockAddress);
      }))
      .pipe(streamAssert.end(error => {
        done(error);
      }));
  });

  it('geocodeStream should pipe geocoder stream', done => {
    const mockAccessor = sinon.stub();

    // Create a mock geocode-stream class that passes elements unchanged.
    class mockGeocodeStream extends ParallelTransform {
      constructor(geocoder, stats, accessor) {
        super(1, {objectMode: true});
        should(accessor).equal(mockAccessor);
        done();
      }
      _parallelTransform(item, done) { // eslint-disable-line no-shadow
        done(null, item);
      }
    }
    const mockGeoCoder = sinon.stub(),
      geoBatch = new GeoBatch(
        getGeocoderOptions({
          accessor: mockAccessor
        }),
        mockGeoCoder,
        mockGeocodeStream
      ),
      mockAddress = 'some address',
      input = intoStream.obj([mockAddress]),
      resultStream = geoBatch.geocodeStream(input);

    resultStream
      .pipe(streamAssert.first(item => {
        should(item).equal(mockAddress);
      }));
  });
});
