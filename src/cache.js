/* eslint-disable one-var */
import flatfile from 'flat-file-db';

/**
 * Cache instance stores already done geocodings
 * @type {Function}
 * @param {String} cacheFile The name of the file to cache
 */
export default class Cache {
  constructor(cacheFile = 'geocache.db') {
    this.db = flatfile.sync(cacheFile);
  }

  /**
   * Add new entries to the Cache
   * @param {String}   address  The address that shall be cached
   * @param {Object}   result The geocoded location
   * @param {Function} callback The callback
   */
  add(address, result, callback = () => {}) {
    this.db.put(address, result, error => {
      if (error) {
        throw error;
      }

      callback();
    });
  }

  /**
   * Add new entries to the Cache
   * @param {String} address  The address that shall be cached
   * @return {Object} The geocoded result
   */
  get(address) {
    return this.db.get(address);
  }
}
