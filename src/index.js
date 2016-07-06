/* eslint-disable one-var */

import intoStream from 'into-stream';
import StandardGeocoder from './geocoder';
import StandardGeocodeStream from './geocode-stream';
import stream from 'stream';
import defaults from './defaults';

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
    {
      cacheFile = 'geocache.db',
      clientId = null,
      privateKey = null,
      apiKey = null,
      maxRetries = defaults.maxRetries,
      queriesPerSecond = defaults.maxQueriesPerSecond,
      accessor = address => address
    } = {
      cacheFile: 'geocache.db',
      clientId: null,
      privateKey: null,
      apiKey: null,
      maxRetries: defaults.maxRetries,
      queriesPerSecond: defaults.maxQueriesPerSecond,
      accessor: address => address
    },
    Geocoder = StandardGeocoder,
    GeocodeStream = StandardGeocodeStream
  ) {
    this.geocoder = new Geocoder({
      cacheFile,
      clientId,
      privateKey,
      apiKey,
      maxRetries,
      queriesPerSecond
    });
    this.GeocodeStream = GeocodeStream;
    this.accessor = accessor;
  }

  /**
   * Geocode the passed in addresses
   * @param {Array/Stream} addresses The addresses to geocode
   * @return {Function} The stream
   */
  geocode(addresses) {
    // If input is already stream, pass through directly.
    if (addresses instanceof stream) {
      return this.geocodeStream(addresses);
    }

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
   * @param  {Stream} inputStream An input stream
   * @param  {Object} stats  An object with the stream stats, defaults to {}.
   * @return {Stream}        A transformable stream.
   */
  geocodeStream(inputStream, stats = {current: 0}) {
    const geocodeStream = new this.GeocodeStream(
      this.geocoder,
      stats,
      this.accessor
    );
    inputStream.pipe(geocodeStream);

    return geocodeStream;
  }
}
