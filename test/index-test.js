/* eslint-disable no-unused-expressions, one-var */
import stream from 'stream';
import intoStream from 'into-stream';

import should from 'should';
import sinon from 'sinon';
import streamAssert from 'stream-assert';

import GeoBatch from '../src/index.js';

describe('Testing GeoBatch', () => {
  it('should create a new instance when called without params', function() {
    const geoBatch = new GeoBatch();

    should.exist(geoBatch);
  });

  it('should accept a clientId and a privateKey', function() {
    /* eslint-disable no-unused-vars */
    const MockGeoCoder = sinon.stub(),
      expectedOptions =
        {cacheFile: 'geocache.db', clientId: null, privateKey: null},
      options = {clientId: 'a clientID', privateKey: 'a privateKey'},
      geoBatch = new GeoBatch(options, null, MockGeoCoder);

    expectedOptions.clientId = 'a clientID';
    expectedOptions.privateKey = 'a privateKey';

    sinon.assert.calledWith(MockGeoCoder, expectedOptions);
  });

  it('should accept an accessor function', function() {
    /* eslint-disable no-unused-vars */
    const mockAccessor = sinon.stub(),
      geoBatch = new GeoBatch({}, mockAccessor);

    should(geoBatch.accessor).be.equal(mockAccessor);
  });

  it('should have a geocode function that accepts and returns a stream',
    function(done) {
      const geoBatch = new GeoBatch();

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
      const geoBatch = new GeoBatch(),
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
    const geoBatch = new GeoBatch(),
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
      geoBatch = new GeoBatch({}, null, mockGeoCoder, mockGeocodeStream),
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
    class mockGeocodeStream extends stream.Transform {
      constructor(geocoder, stats, accessor) {
        super({objectMode: true});
        should(accessor).equal(mockAccessor);
        done();
      }
      _transform(item, encoding, done) { // eslint-disable-line
        this.push(item);
        done();
      }
    }
    const mockGeoCoder = sinon.stub(),
      geoBatch = new GeoBatch(
        {},
        mockAccessor,
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
