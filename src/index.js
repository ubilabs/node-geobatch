/* eslint-disable one-var */

import ArrayStream from './array-stream';
import Geocoder from './geocoder';
import GeocodeStream from './geocode-stream';

/**
 * GeoBatch instance
 * @type {Function}
 * @param {Object} options The options for the GeoBatch
 */
export default class GeoBatch {
  constructor(options = {}) {
    this.geocoder = new Geocoder({
      cacheFile: options.cacheFile || 'geocache.db',
      clientId: options.clientId,
      privateKey: options.privateKey
    });
  }

  /**
   * Geocode the passed in addresses
   * @param {Array} addresses The addresses to geocode
   * @return {Function} The stream
   */
  geocode(addresses) {
    const arrayStream = new ArrayStream(addresses),
      geocodeStream = new GeocodeStream(this.geocoder);

    geocodeStream.stats = {
      total: addresses.length,
      current: 0,
      startTime: new Date()
    };
    arrayStream.pipe(geocodeStream);

    return geocodeStream;
  }
}
