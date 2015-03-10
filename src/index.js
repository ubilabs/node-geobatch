/* eslint-disable one-var */

const stream = require('stream'),
  util = require('util'),
  ArrayStream = require('./array-stream'),
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
 * @param {Array} rawAddresses The addresses to geocode
 * @return {Function} The stream
 */
GeoBatch.prototype.geocode = function(rawAddresses) {
  const arrayStream = new ArrayStream(rawAddresses),
    geocodeStream = new GeocodeStream(this.geocoder);

  geocodeStream.stats = {
    total: rawAddresses.length,
    current: 0,
    startTime: new Date()
  };
  arrayStream.pipe(geocodeStream);

  return geocodeStream;
};

/**
 * A streaming object for the geocode
 * @param {Object} geocoder The geocoder
 */
function GeocodeStream(geocoder) {
  stream.Transform.call(this, {objectMode: true});

  this.geocoder = geocoder;
}
util.inherits(GeocodeStream, stream.Transform);

/* eslint-disable no-underscore-dangle */
/**
 * The _transform function for the stream.
 * @param {String}   rawAddress The address to geocode
 * @param {String}   enc The encryption
 * @param {Function} done The done callback function
 */
GeocodeStream.prototype._transform = function(rawAddress, enc, done) {
  /* eslint-enable no-underscore-dangle */

  this.geocoder.geocodeAddress(rawAddress)
    .then((address) => {
      let result = this.getMetainfo(rawAddress);

      result.address = address;
      this.push(result);
      done();
    })
    .catch((error) => {
      let result = this.getMetainfo(rawAddress);

      result.error = error.message;
      this.push(result);
      done();
    });
};

/**
 * Get the result meta information
 * @param {String} rawAddress The address
 * @return {Object} The meta information
 */
GeocodeStream.prototype.getMetainfo = function(rawAddress) {
  this.stats.current++;

  const now = new Date(),
    ratio = this.stats.current / this.stats.total;

  return {
    error: null,
    rawAddress: rawAddress,
    address: {},
    total: this.stats.total,
    current: this.stats.current,
    pending: this.stats.total - this.stats.current,
    percent: ratio * 100,
    estimatedDuration: Math.round((now - this.stats.startTime) / ratio)
  };
};

module.exports = GeoBatch;
