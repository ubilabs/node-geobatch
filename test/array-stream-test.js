/* eslint-disable no-unused-expressions, one-var */
const should = require('should'),
  ArrayStream = require('../src/array-stream.js');

describe('Testing array-stream', function() {
  it('should create a new instance', function() {
    const arrayStream = new ArrayStream();

    should.exist(arrayStream);
  });

  it('should have a _read function for the streaming functionality',
    function() {
      const arrayStream = new ArrayStream();

      /* eslint-disable no-underscore-dangle */
      should(arrayStream._read).be.a.Function;
     /* eslint-enable no-underscore-dangle */
    }
  );

  it('should convert an array of Strings into a stream', function(done) {
    const arrayStream = new ArrayStream(['foo', 'bar']);

    var convertedValues = 0,
      converted = {
        foo: false,
        bar: false
      };

    arrayStream
      .on('data', function(data) {
        should(data).be.a.String;
        converted[data] = true;
        convertedValues++;
      })
      .on('end', function() {
        should.equal(convertedValues, 2);
        should(converted.foo).be.true;
        should(converted.bar).be.true;
        done();
      });
  });
});
