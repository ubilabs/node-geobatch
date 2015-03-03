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

module.exports = Cache;
