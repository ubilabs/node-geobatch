import ParallelTransform from './lib/parallel-transform';

/**
 * A streaming object for the geocode
 * @param {Object} geocoder The geocoder
 */
export default class GeocodeStream extends ParallelTransform {
  /**
   * Constructs a geocodeStream.
   * @param  {Object} geocoder A geocoder.
   * @param  {Number} queriesPerSecond The number of queries per second
   * @param  {Object} stats A statistics object.
   * @param  {Function} accessor An accessor function that returns the address
   *                             from the data item. The default returns the
   *                             data item directly.
   */
  constructor(geocoder,
    queriesPerSecond,
    stats = {current: 0},
    accessor = address => address
  ) {
    super(queriesPerSecond, {objectMode: true});

    this.geocoder = geocoder;
    this.stats = stats;
    this.accessor = accessor;
  }

  /**
   * The _parallelTransform function for the stream.
   * @param {String}   input The address to geocode
   * @param {Function} done The done callback function
   */
  _parallelTransform(input, done) { // eslint-disable-line
    const data = this.getMetaInfo(input);

    this.geocoder.geocodeAddress(this.accessor(input))
      .then(results => {
        data.result = results[0];
        data.results = results;
        data.location = results[0].geometry.location;
        done(null, data);
      })
      .catch(error => {
        data.error = error.message;
        done(null, data);
      });
  }

  /**
   * Get the result meta information
   * @param {String} input The input
   * @return {Object} The meta information
   */
  getMetaInfo(input) {
    this.stats.current++;

    let metaInfo = {
      error: null,
      address: this.accessor(input),
      input: input,
      location: {},
      result: {},
      current: this.stats.current
    };

    if (this.stats.hasOwnProperty('total')) {
      const now = new Date(),
        ratio = this.stats.current / this.stats.total;

      Object.assign(metaInfo, {
        total: this.stats.total,
        pending: this.stats.total - this.stats.current,
        percent: ratio * 100,
        estimatedDuration: Math.round((now - this.stats.startTime) / ratio)
      });
    }
    return metaInfo;
  }
}
