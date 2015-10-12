/* eslint-disable one-var */

import intoStream from 'into-stream';
import StandardGeocoder from './geocoder';
import StandardGeocodeStream from './geocode-stream';

/**
 * GeoBatch instance
 * @type {Function}
 * @param {Object} options The options for the GeoBatch, default is
 *                         {cacheFile: 'geocache.db',
 *                           clientId: null,
 *                           privateKey: null}
 * @param {Object} Geocoder A geocoder.
 * @param {Object} GeocodeStream A GeocodeStream.
 */
export default class GeoBatch {
  constructor(
    {cacheFile = 'geocache.db', clientId = null, privateKey = null}
      = {cacheFile: 'geocache.db', clientId: null, privateKey: null},
    Geocoder = StandardGeocoder,
    GeocodeStream = StandardGeocodeStream
  ) {
    this.geocoder = new Geocoder({cacheFile, clientId, privateKey});
    this.GeocodeStream = GeocodeStream;
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

    return this.geocodeStream(arrayStream, stats);
  }

  /**
   * Geocode the elements of a passed in stream.
   * @param  {Stream} stream An input stream
   * @param  {Object} stats  An object with the stream stats, defaults to {}.
   * @return {Stream}        A transformable stream.
   */
  geocodeStream(stream, stats = {}) {
    const geocodeStream = new this.GeocodeStream(this.geocoder, stats);
    stream.pipe(geocodeStream);

    return geocodeStream;
  }
}
