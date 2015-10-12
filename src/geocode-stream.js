import stream from 'stream';

/**
 * A streaming object for the geocode
 * @param {Object} geocoder The geocoder
 */
export default class GeocodeStream extends stream.Transform {
  /**
   * Constructs a geocodeStream.
   * @param  {Object} geocoder A geocoder.
   * @param  {Object} stats A statistics object.
   */
  constructor(geocoder, stats) {
    super({objectMode: true});

    this.geocoder = geocoder;
    this.stats = stats;
  }

  /**
   * The _transform function for the stream.
   * @param {String}   address The address to geocode
   * @param {String}   encoding The encoding
   * @param {Function} done The done callback function
   */
  _transform(address, encoding, done) { // eslint-disable-line
    this.geocoder.geocodeAddress(address)
      .then(result => {
        let data = this.getMetaInfo(address);
        data.result = result;
        data.location = result.geometry.location;
        this.push(data);
        done();
      })
      .catch(error => {
        let data = this.getMetaInfo(address);

        data.error = error.message;
        this.push(data);
        done();
      });
  }

  /**
   * Get the result meta information
   * @param {String} address The address
   * @return {Object} The meta information
   */
  getMetaInfo(address) {
    this.stats.current++;

    const now = new Date(),
      ratio = this.stats.current / this.stats.total;
    return {
      error: null,
      address: address,
      location: {},
      result: {},
      total: this.stats.total,
      current: this.stats.current,
      pending: this.stats.total - this.stats.current,
      percent: ratio * 100,
      estimatedDuration: Math.round((now - this.stats.startTime) / ratio)
    };
  }
}
