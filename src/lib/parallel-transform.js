import stream from 'stream';
import cyclist from 'cyclist';

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

  destroy() {
    if (this.destroyed) {
      return;
    }

    this.destroyed = true;
    this.emit('close');
  }

  _transform(chunk, enc, done) {
    var pos = this.top++;

    this._parallelTransform(chunk, (err, data) => { // eslint-disable-line no-underscore-dangle, max-len
      if (this.destroyed) {
        return;
      }

      if (err) {
        this.emit('error', err);
        this.push(null);
        this.destroy();
        return;
      }

      this.buffer.put(pos, typeof data === 'undefined' || data === null ? null : data); // eslint-disable-line max-len
      this.drain();
    });

    if (this.top - this.bottom < this.maxParallel) {
      return done();
    }

    this.ondrain = done;
  }

  _parallelTransform() {
    throw new Error('Not implemented');
  }

  _flush(done) {
    this.flushed = true;
    this.ondrain = done;
    this.drain();
  }

  drain() {
    while (typeof this.buffer.get(this.bottom) !== 'undefined') {
      let data = this.buffer.del(this.bottom++);
      if (data === null) {
        continue;
      }
      this.push(data);
    }

    if (!this.drained() || !this.ondrain) {
      return;
    }

    var ondrain = this.ondrain;
    this.ondrain = null;
    ondrain();
  }

  drained() {
    var diff = this.top - this.bottom;
    return this.flushed ? !diff : diff < this.maxParallel;
  }
}
