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
GeoBatch.prototype.geocode = function(addresses) {
  const addressesStream = new AddressesStream(addresses),
    geocodeStream = new GeocodeStream(this.geocoder);

  addressesStream.pipe(geocodeStream);

  return geocodeStream;
};

/**
 * A streaming object for the geocode
 * @param {Array} addresses The addresses
 */
function AddressesStream(addresses) {
  stream.Readable.call(this, {objectMode: true});

  this.addresses = addresses;
  this.curIndex = 0;
}
util.inherits(AddressesStream, stream.Readable);

/**
 * The _read function for the addresses stream.
 */
/* eslint-disable no-underscore-dangle */
AddressesStream.prototype._read = function() {
/* eslint-enable no-underscore-dangle */
  if (this.curIndex === this.addresses.length) {
    return this.push(null);
  }

  this.push(this.addresses[this.curIndex++]);
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

/**
 * The _transform function for the stream.
 */
/* eslint-disable no-underscore-dangle */
GeocodeStream.prototype._transform = function(address, enc, done) {
/* eslint-enable no-underscore-dangle */
  this.geocoder.geocodeAddress(address)
    .then((location) => {
      this.push({
        address: address,
        location: location
      });
      done();
    });
};

module.exports = GeoBatch;
