/* eslint-disable one-var */

const stream = require('stream'),
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
GeoBatch.prototype.geocode = function(addresses = []) {
  return new GeocodeStream(this.geocoder, addresses);
};

/**
 * A streaming object for the geocode
 * @param {Object} geocoder The geocoder
 * @param {Array} addresses The addresses to geocode
 */
function GeocodeStream(geocoder, addresses) {
  stream.Readable.call(this, {objectMode: true});

  this.geocoder = geocoder;
  this.addresses = addresses;
  this.addressCount = addresses.length;
  this.geocodedAddresses = 0;
}
util.inherits(GeocodeStream, stream.Readable);

/**
 * The _read function for the stream.
 */
/* eslint-disable no-underscore-dangle */
GeocodeStream.prototype._read = function() {
/* eslint-enable no-underscore-dangle */
  if (this.addressCount === 0) {
    return this.push(null);
  }

  this.addresses.forEach((address) => {
    this.geocoder.geocodeAddress(address)
      .then((location) => {
        this.push({
          address: address,
          location: location
        });
        this.geocodedAddresses++;

        if (this.geocodedAddresses === this.addressCount) {
          this.push(null);
        }
      });
  });
};

module.exports = GeoBatch;
