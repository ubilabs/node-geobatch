/* eslint-disable one-var */

const Cache = require('./cache');

/**
 * GeoBatch instance
 * @type {Function}
 * @param {Object} options The options for the GeoBatch
 */
const GeoBatch = function(options) {
  options = options || {};

  const cacheFile = options.cacheFile || 'geocache.db';

  this.cache = new Cache(cacheFile);
};

module.exports = GeoBatch;
