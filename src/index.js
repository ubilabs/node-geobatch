/* eslint-disable one-var */

import intoStream from 'into-stream';
import StandardGeocoder from './geocoder';
import GeocodeStream from './geocode-stream';

/**
 * GeoBatch instance
 * @type {Function}
 * @param {Object} options The options for the GeoBatch
 */
export default class GeoBatch {
  constructor(
    {cacheFile = 'geocache.db', clientId = null, privateKey = null}
      = {cacheFile: 'geocache.db', clientId: null, privateKey: null},
    Geocoder = StandardGeocoder) {
    this.geocoder = new Geocoder({cacheFile, clientId, privateKey});
  }

  /**
   * Geocode the passed in addresses
   * @param {Array} addresses The addresses to geocode
   * @return {Function} The stream
   */
  geocode(addresses) {
    const arrayStream = intoStream.obj(addresses),
      stats = {
        total: addresses.length,
        current: 0,
        startTime: new Date()
      };
    const geocodeStream = new GeocodeStream(this.geocoder, stats);

    arrayStream.pipe(geocodeStream);

    return geocodeStream;
  }
}
