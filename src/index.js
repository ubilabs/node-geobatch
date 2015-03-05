/* eslint-disable one-var */

const Readable = require('stream').Readable,
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
GeoBatch.prototype.geocode = function() {
  const readStream = new Readable();

  readStream.push(null);

  return readStream;
};

module.exports = GeoBatch;
