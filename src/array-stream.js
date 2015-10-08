import stream from 'stream';

/**
 * Create a stream from an array
 * @param {Array} values The values
 */
export default class ArrayStream extends stream.Readable {
  /**
   * Constructs an Array stream.
   * @param  {Array} values The array to base the stream on.
   */
  constructor(values) {
    super({objectMode: true});

    this.values = values;
    this.currentIndex = 0;
  }

  /**
   * The _read function for the addresses stream.
   */
  _read() { // eslint-disable-line no-underscore-dangle
    if (this.currentIndex === this.values.length) {
      this.push(null);
      return;
    }

    this.push(this.values[this.currentIndex++]);
  }

}
