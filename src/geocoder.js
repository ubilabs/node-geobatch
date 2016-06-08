/* eslint-disable one-var */

import Cache from './cache';
import isEmpty from 'amp-is-empty';
import GoogleGeocoder from './lib/google-geocoder';
import Errors from './errors';

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
    options.clientId = options.clientId || null;
    options.privateKey = options.privateKey || null;

    if (options.clientId && !options.privateKey) {
      throw new Error('Missing privateKey');
    }

    if (!options.clientId && options.privateKey) {
      throw new Error('Missing clientId');
    }

    this.timeBetweenRequests =
      options.clientId && options.privateKey ? 100 : 200;
    this.maxRequests = 20;

    this.lastGeocode = new Date();
    this.currentRequests = 0;

    this.cache = new GeoCache(options.cacheFile);
    this.geocoder = geocoder.init(options);
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

    this.geocoder.geocode(address.replace('\'', ''), (error, response) => {
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
