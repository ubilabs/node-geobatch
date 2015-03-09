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

  this.timeBetweenRequests = options.clientId && options.privateKey ? 100 : 200;
  this.maxRequests = 20;

  this.lastGeocode = new Date();
  this.currentRequests = 0;

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

    this.startGeocode(address, resolve, reject);
  });
};

/**
 * Start geocoding a single address
 * @param {String} address The address to geocode
 * @param {Function} resolve The Promise resolve function
 * @param {Function} reject The Promise reject function
 */
Geocoder.prototype.startGeocode = function(address, resolve, reject) {
  let now = new Date();

  if (
    this.currentRequests >= this.maxRequests ||
    now - this.lastGeocode <= this.timeBetweenRequests
  ) {
    setTimeout(() => {
      this.startGeocode(address, resolve, reject);
    }, this.timeBetweenRequests);
    return;
  }

  this.currentRequests++;
  this.lastGeocode = now;

  this.googlemaps.geocode(address, (error, response) => {
    this.currentRequests--;

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
};

module.exports = Geocoder;
