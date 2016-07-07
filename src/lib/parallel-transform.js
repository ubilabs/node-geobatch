import stream from 'stream';
import cyclist from 'cyclist';

  /**
   * ParallelTransform instance
   * All child classes must implement the `_parallelTransform` function.
   * Child class should not implement the `_transform` and `_flush` functions.
   *
   * @param {Number} maxParallel The maximum number of
   *                             simulatenous transformations
   * @param {Object} options Options which will be passed
   *                         to the `stream.Transform` constructor
   **/
export default class ParallelTransform extends stream.Transform {
  constructor(maxParallel = 1, options = {}) {
    options.highWaterMark = options.highWaterMark || Math.max(maxParallel, 16);

    super(options);

    this.maxParallel = maxParallel;
    this.destroyed = false;
    this.flushed = false;
    this.buffer = cyclist(maxParallel);
    this.top = 0;
    this.bottom = 0;
    this.ondrain = null;
  }

  /**
   * Destroys the stream
   * The results of all pending transformations will be discarded
   **/
  destroy() {
    if (this.destroyed) {
      return;
    }

    this.destroyed = true;
    this.emit('close');
  }

  /**
   * Called for every item in the stream
   * @param {?} chunk The chunk of data to be transformed
   * @param {String} enc Encoding, if it `chunk` is a string
   * @param {Function} done Callback to be called when finished
   * @return {?} Something to get out
   **/
  _transform(chunk, enc, done) {
    const pos = this.top++;

    this._parallelTransform(chunk, (err, data) => { // eslint-disable-line no-underscore-dangle, max-len
      if (this.destroyed) {
        return;
      }

      // abort on error
      if (err) {
        this.emit('error', err);
        this.push(null);
        this.destroy();
        return;
      }

      // insert result into corresponding place in buffer
      const result = typeof data === 'undefined' || data === null ? null : data;
      this.buffer.put(pos, result);

      // attempt to drain the buffer
      this.drain();
    });

    // immediatelly signal `done` if no more than `maxParallel` results buffered
    if (this.top - this.bottom < this.maxParallel) {
      return done();
    }

    // otherwise wait until a transformation finished
    this.ondrain = done;
  }

  /**
   * The _transform method of the parallel transform stream
   * This method must be re-implemented by child classes
   * @param {?} data Data to be transformed
   * @param {Function} done Callback which must be executed
   *                        when transformations have finished
   **/
  _parallelTransform(data, done) { // eslint-disable-line no-unused-vars
    throw new Error('Not implemented');
  }

  /**
   * Called when all items have been processed
   * @param {Function} done Callback to signify when done
   **/
  _flush(done) {
    this.flushed = true;
    this.ondrain = done;
    this.drain();
  }

  /**
   * Fire the `data` event for buffered items, in order
   * The buffer will be cleared in such a way that the
   * order of the input items is preserved. This means that calling
   * `drain` does not necessarily clear the entire buffer, as it will
   * have to wait for further results if a transformation has not yet finished
   * This function should never be called from outside this class
   **/
  drain() {
    // clear the buffer until we reach an item who's result has not yet arrived
    while (typeof this.buffer.get(this.bottom) !== 'undefined') {
      const data = this.buffer.del(this.bottom++);

      if (data === null) {
        continue;
      }

      this.push(data);
    }

    // call `ondrain` if the buffer is drained
    if (this.drained() && this.ondrain) {
      const ondrain = this.ondrain;
      this.ondrain = null;
      ondrain();
    }
  }

  /**
   * Checks whether or not the buffer is drained
   * While receiving chunks, the buffer counts as drained as soon as
   * no more than `maxParallel` items are buffered.
   * When the stream is being flushed, the buffer counts as drained
   * if and only if it is entirely empty.
   * @return {Boolean} true if drained
   **/
  drained() {
    var diff = this.top - this.bottom;
    return this.flushed ? !diff : diff < this.maxParallel;
  }
}
