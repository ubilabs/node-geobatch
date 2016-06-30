/* eslint-disable one-var */

import Cache from './cache';
import isEmpty from 'amp-is-empty';
import GoogleGeocoder from './lib/google-geocoder';
import Errors from './errors';

const defaults = {
  clientId: null,
  privateKey: null,
  apiKey: null,
  queriesPerSecond: 50
};

/**
 * Validate a Geocoder options object
 * This function throws an exception if the options are invalid
 * @param {Object} options The options object to be validated
 */
function validateOptions(options) { // eslint-disable-line complexity
  if ((options.clientId || options.privateKey) && options.apiKey) {
    throw new Error('Can only specify credentials or API key');
  }

  if (options.clientId && !options.privateKey) {
    throw new Error('Missing privateKey');
  }

  if (!options.clientId && options.privateKey) {
    throw new Error('Missing clientId');
  }

  if (!options.apiKey && !(options.clientId && options.privateKey)) {
    throw new Error('Must either provide credentials or API key');
  }

  if (options.queriesPerSecond < 1 || options.queriesPerSecond > 50) {
    throw new Error('Requests per second must be >= 1 and <= 50');
  }
}

/**
 * Geocoder instance
 * @type {Class}
 * @param {Object} options The options for the Geocoder
 */
export default class Geocoder {
  /**
   * Constructs a geocoder.
   * @param  {Object} options Geocoder options.
   */
  constructor(options = {}, geocoder = GoogleGeocoder, GeoCache = Cache) {
    options = Object.assign({}, defaults, options);
    validateOptions(options);

    this.timeBetweenRequests = Math.ceil(1000 / options.queriesPerSecond);
    this.maxRequests = 20;
    this.lastGeocode = new Date();
    this.currentRequests = 0;

    this.cache = new GeoCache(options.cacheFile);
    this.geocoder = geocoder.init({
      clientId: options.clientId,
      privateKey: options.privateKey,
      key: options.apiKey
    });
  }

  /**
   * Geocode a single address
   * @param {String} address The address to geocode
   * @return {Promise} The promise
   */
  geocodeAddress(address) {
    return new Promise((resolve, reject) => {
      this.startGeocode(address, resolve, reject);
    });
  }

  /**
   * Start geocoding a single address
   * @param {String} address The address to geocode
   * @param {Function} resolve The Promise resolve function
   * @param {Function} reject The Promise reject function
   * @return {?} Something to get out
   */
  startGeocode(address, resolve, reject) {
    const cachedAddress = this.cache.get(address);
    if (cachedAddress) {
      return resolve(cachedAddress);
    }

    let now = new Date();

    if (
      this.currentRequests >= this.maxRequests ||
      now - this.lastGeocode <= this.timeBetweenRequests
    ) {
      return setTimeout(() => {
        this.startGeocode(address, resolve, reject);
      }, this.timeBetweenRequests);
    }

    this.currentRequests++;
    this.lastGeocode = now;

    const geoCodeParams = {
      address: address.replace('\'', '')
    };

    this.geocoder.geocode(geoCodeParams, (error, response) => {
      this.currentRequests--;

      if (error) {
        const errorMessage = Errors[error.code] ||
          'Google Maps API error: ' + error.code;

        return reject(new Error(errorMessage));
      }

      if (response.status === 'OVER_QUERY_LIMIT') {
        return reject(new Error('Over query limit'));
      }

      if (isEmpty(response.results)) {
        return reject(new Error('No results found'));
      }

      const results = response.results;

      this.cache.add(address, results);
      return resolve(results);
    });
  }
}
