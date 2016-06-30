/* eslint-disable one-var */

import Cache from './cache';
import isEmpty from 'amp-is-empty';
import GoogleGeocoder from './lib/google-geocoder';
import Errors from './errors';
import defaults from './defaults';

const geocoderDefaults = {
  clientId: null,
  privateKey: null,
  apiKey: null,
  queriesPerSecond: defaults.maxQueriesPerSecond
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

  if (options.queriesPerSecond < defaults.minQueriesPerSecond ||
    options.queriesPerSecond > defaults.maxQueriesPerSecond
  ) {
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
    options = Object.assign({}, geocoderDefaults, options);
    validateOptions(options);

    this.qps = options.queriesPerSecond;
    this.queries = -1;

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
      this.queueGeocode(address, resolve, reject);
    });
  }

  /**
   * Add a geocoding operation to the queue of geocodes
   * @param {String} address The address to geocode
   * @param {Function} resolve The Promise resolve function
   * @param {Function} reject The Promise reject function
   * @return {?} Something to get out
   */
  queueGeocode(address, resolve, reject) {
    const cachedAddress = this.cache.get(address);
    if (cachedAddress) {
      return resolve(cachedAddress);
    }

    if (this.queries === -1) {
      this.startBucket();
    } else if (this.queries >= this.qps) {
      // maximum number of queries for this bucket exceeded
      return setTimeout(() => {
        this.queueGeocode(address, resolve, reject);
      }, 100);
    }

    this.queries++;
    this.startGeocode(address, resolve, reject);
  }

  /**
   * Reset query count and start a timeout of 1 second for this bucket
   **/
  startBucket() {
    this.queries = 0;
    setTimeout(() => {
      this.queries = -1;
    }, 1000);
  }

  /**
   * Start geocoding a single address
   * @param {String} address The address to geocode
   * @param {Function} resolve The Promise resolve function
   * @param {Function} reject The Promise reject function
   */
  startGeocode(address, resolve, reject) {
    const geoCodeParams = {
      address: address.replace('\'', '')
    };

    this.geocoder.geocode(geoCodeParams, (error, response) => {
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
