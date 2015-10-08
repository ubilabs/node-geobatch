/* eslint-disable one-var */
import flatfile from 'flat-file-db';

/**
 * Cache instance to store key value pairs.
 * @type {Class}
 * @param {String} cacheFile The name of the file to cache
 */
export default class Cache {
  constructor(cacheFile = 'geocache.db') {
    this.db = flatfile.sync(cacheFile);
  }

  /**
   * Add new entries to the Cache
   * @param {String}   key  The key that shall be cached
   * @param {Object}   value The value that should be stored in the cache
   * @param {Function} callback The callback
   */
  add(key, value, callback = () => {}) {
    this.db.put(key, value, error => {
      if (error) {
        throw error;
      }

      callback();
    });
  }

  /**
   * Add new entries to the Cache
   * @param {String} key  The key that should be retrieved
   * @return {Object} The value
   */
  get(key) {
    return this.db.get(key);
  }
}
