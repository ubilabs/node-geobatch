/* eslint-disable no-unused-expressions, one-var */
import should from 'should';
import GeoBatch from '../src/index.js';
import assert from 'assert';
import sinon from 'sinon';
import streamAssert from 'stream-assert';
import stream from 'stream';
import intoStream from 'into-stream';

assert.called = sinon.assert.called;
assert.calledWith = sinon.assert.calledWith;

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
      geoBatch = new GeoBatch(options, MockGeoCoder);

    expectedOptions.clientId = 'a clientID';
    expectedOptions.privateKey = 'a privateKey';

    assert.calledWith(MockGeoCoder, expectedOptions);
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
      const SecondGeocodeStreamArguments = geocodeStreamFunction.args[0][1];
      should(SecondGeocodeStreamArguments.total).equal(expectedTotal);
      should(SecondGeocodeStreamArguments.current).equal(expectedCurrent);
      should(SecondGeocodeStreamArguments.startTime).be.instanceof(Date);
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
    const FirstGeocodeStreamArguments = geocodeStreamFunction.args[0][0];
    // Check for instance of stream.
    should(FirstGeocodeStreamArguments).be.instanceof(stream);

    // Check if first element of stream is equal to input.
    FirstGeocodeStreamArguments
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
      geoBatch = new GeoBatch({}, mockGeoCoder, mockGeocodeStream),
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
});
