const stream = require('stream');

/**
 * Create a stream from an array
 * @param {Array} values The values
 */
export default class ArrayStream extends stream.Readable {
  constructor(values) {
    super({objectMode: true});

    this.values = values;
    this.currentIndex = 0;
  }

  /**
   * The _read function for the addresses stream.
   */
  /* eslint-disable no-underscore-dangle */
  _read() {
  /* eslint-enable no-underscore-dangle */
    if (this.currentIndex === this.values.length) {
      return this.push(null);
    }

    this.push(this.values[this.currentIndex++]);
  }

}
