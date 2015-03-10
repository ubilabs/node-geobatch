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
 * @param {String}   rawAddress  The address that shall be cached
 * @param {Object}   address The geocoded location
 * @param {Function} callback The callback
 */
Cache.prototype.add = function(
  rawAddress,
  address,
  callback = function() {}
) {
  this.db.put(rawAddress, address, (error) => {
    if (error) {
      throw error;
    }

    callback();
  });
};

/**
 * Add new entries to the Cache
 * @param {String} rawAddress  The address that shall be cached
 * @return {Object} The geocoded address
 */
Cache.prototype.get = function(rawAddress) {
  return this.db.get(rawAddress);
};

module.exports = Cache;
