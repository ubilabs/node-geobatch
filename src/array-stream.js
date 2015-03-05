const stream = require('stream'),
  util = require('util');

/**
 * Create a stream from an array
 * @param {Array} values The values
 */
function ArrayStream(values) {
  stream.Readable.call(this, {objectMode: true});

  this.values = values;
  this.currentIndex = 0;
}
util.inherits(ArrayStream, stream.Readable);

/**
 * The _read function for the addresses stream.
 */
/* eslint-disable no-underscore-dangle */
ArrayStream.prototype._read = function() {
/* eslint-enable no-underscore-dangle */
  if (this.currentIndex === this.values.length) {
    return this.push(null);
  }

  this.push(this.values[this.currentIndex++]);
};

module.exports = ArrayStream;
