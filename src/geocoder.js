/* eslint-disable one-var */

const Cache = require('./cache');

/**
 * Geocoder instance
 * @type {Function}
 * @param {Object} options The options for the Geocoder
 */
const Geocoder = function(options) {
  options = options || {};
  options.clientId = options.clientId || null;
  options.privateKey = options.privateKey || null;

  if (options.clientId && !options.privateKey) {
    throw new Error('Missing privateKey');
  }

  if (!options.clientId && options.privateKey) {
    throw new Error('Missing clientId');
  }

  this.cache = new Cache(options.cacheFile);
  this.googlemaps = require('googlemaps');

  this.googlemaps.config('google-client-id', options.clientId);
  this.googlemaps.config('google-private-key', options.privateKey);
};

/**
 * Geocode a single address
 * @param {String} address The address to geocode
 * @return {Promise} A new promise
 */
Geocoder.prototype.geocodeAddress = function(address) {
  address = address.replace('\'', '');

  const cachedAddress = this.cache.get(address);

  return new Promise((resolve) => {
    if (cachedAddress) {
      resolve(cachedAddress);
      return;
    }

    this.googlemaps.geocode(address, (error, response) => {
      const location = response.results[0].geometry.location;

      this.cache.add(address, location);
      resolve(location);
    });
  });
};

module.exports = Geocoder;
