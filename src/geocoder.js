/* eslint-disable one-var */

const Cache = require('./cache'),
  isEmpty = require('amp-is-empty');

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
 * @return {Promise} The promise
 */
Geocoder.prototype.geocodeAddress = function(address) {
  address = address.replace('\'', '');

  const cachedAddress = this.cache.get(address);

  return new Promise((resolve, reject) => {
    if (cachedAddress) {
      return resolve(cachedAddress);
    }

    this.googlemaps.geocode(address, (error, response) => {
      if (error) {
        return reject(new Error('Wrong clientId or privateKey'));
      }

      if (response.status === 'OVER_QUERY_LIMIT') {
        return reject(new Error('Over query limit'));
      }

      if (isEmpty(response.results)) {
        return reject(new Error('No results found'));
      }

      const location = response.results[0].geometry.location;

      this.cache.add(address, location);
      return resolve(location);
    });
  });
};

module.exports = Geocoder;
