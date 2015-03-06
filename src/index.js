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
 * @param {Array} addresses The addresses to geocode
 * @return {Function} The stream
 */
GeoBatch.prototype.geocode = function(addresses) {
  const arrayStream = new ArrayStream(addresses),
    geocodeStream = new GeocodeStream(this.geocoder);

  geocodeStream.stats = {
    total: addresses.length,
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
 * @param {String}   address The address to geocode
 * @param {String}   enc The encryption
 * @param {Function} done The done callback function
 */
GeocodeStream.prototype._transform = function(address, enc, done) {
  /* eslint-enable no-underscore-dangle */

  this.geocoder.geocodeAddress(address)
    .then((location) => {
      this.stats.current++;

      const now = new Date(),
        ratio = this.stats.current / this.stats.total;

      this.push({
        address: address,
        location: location,
        total: this.stats.total,
        current: this.stats.current,
        pending: this.stats.total - this.stats.current,
        percent: ratio * 100,
        estimatedDuration: Math.round((now - this.stats.startTime) / ratio)
      });

      done();
    });
};

module.exports = GeoBatch;
