/* eslint-disable one-var */

const Readable = require('stream').Readable,
  util = require('util'),
  Geocoder = require('./geocoder');

/**
 * GeoBatch instance
 * @type {Function}
 * @param {Object} options The options for the GeoBatch
 */
const GeoBatch = function(options) {
  options = options || {};

  this.geocoder = new Geocoder({
    cacheFile: options.cacheFile || 'geocache.db',
    clientId: options.clientId,
    privateKey: options.privateKey
  });
};

/**
 * Geocode the passed in addresses
 * @param {Array} addresses The addresses to geocode
 * @return {Function} The stream
 */
GeoBatch.prototype.geocode = function(addresses) {
  return new Readstream(addresses);
};

/**
 * A streaming object for the geocode
 * @param {Array} addresses The addresses to geocode
 */
function Readstream(addresses) {
  Readable.call(this, {objectMode: true});
  this.addresses = addresses;
  this.curIndex = 0;
}
util.inherits(Readstream, Readable);

/**
 * The _read function for the stream.
 */
/* eslint-disable no-underscore-dangle */
Readstream.prototype._read = function() {
/* eslint-enable no-underscore-dangle */
  if (this.curIndex === this.addresses.length) {
    return this.push(null);
  }

  this.push(this.addresses[this.curIndex++]);
};

module.exports = GeoBatch;
