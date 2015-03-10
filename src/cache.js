/* eslint-disable one-var */

const flatfile = require('flat-file-db');

/**
 * Cache instance stores already done geocodings
 * @type {Function}
 * @param {String} cacheFile The name of the file to cache
 */
const Cache = function(cacheFile = 'geocache.db') {
  this.db = flatfile.sync(cacheFile);
};

/**
 * Add new entries to the Cache
 * @param {String}   address  The address that shall be cached
 * @param {Object}   location The geocoded location
 * @param {Function} callback The callback
 */
Cache.prototype.add = function(
  address,
  location,
  callback = function() {}
) {
  this.db.put(address, location, (error) => {
    if (error) {
      throw error;
    }

    callback();
  });
};

/**
 * Add new entries to the Cache
 * @param {String} address  The address that shall be cached
 * @return {Object} The geocoded location
 */
Cache.prototype.get = function(address) {
  return this.db.get(address);
};

module.exports = Cache;
