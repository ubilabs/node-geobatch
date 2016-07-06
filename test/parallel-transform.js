/* eslint-disable no-unused-expressions */
import should from 'should';
import sinon from 'sinon';
import ParallelTransform from '../src/lib/parallel-transform';
import {getParallelTransformStream} from './lib/helpers';

describe('Testing ParallelTransform', () => {
  it('should call a child\'s _parallelTransform function on write', done => {
    const transformStub = sinon.stub().callsArgWith(1),
      ParallelTransformStub = getParallelTransformStream(transformStub),
      transformInstance = new ParallelTransformStub(),
      data = 'some data';

    transformInstance.on('data', () => {});
    transformInstance.on('end', () => {
      should(transformStub.calledOnce).equal(true);
      should(transformStub.args[0][0].toString()).equal(data);
      done();
    });

    transformInstance.write(data);
    transformInstance.end();
  });

  it('should emit the _parallelTransform function\'s data', done => {
    const result = 'some result',
      ParallelTransformStub = getParallelTransformStream(
        sinon.stub().callsArgWith(1, null, result)
      ),
      transformInstance = new ParallelTransformStub();

    transformInstance.on('data', data => should(data.toString()).equal(result));
    transformInstance.on('end', done);

    transformInstance.write('some data');
    transformInstance.end();
  });

  it('should throw an error when not implementing _parallelTransform', () => {
    class BrokenParallelTransform extends ParallelTransform {}
    const transformInstance = new BrokenParallelTransform();

    should(() => {
      transformInstance.write('some data');
    }).throw('Not implemented');
  });

  it('should pass options on to the stream.Transform constructor', done => {
    const transformStub = sinon.stub().callsArg(1),
      data = {someKey: 'someValue'},
      maxParallel = 1,
      options = {objectMode: true},
      ParallelTransformStub = getParallelTransformStream(
        transformStub,
        maxParallel,
        options
      ),
      transformInstance = new ParallelTransformStub();

    transformInstance.on('data', result => {
      should(result).deepEqual(data);
    });

    transformInstance.on('end', () => {
      should(transformStub.calledOnce).equal(true);
      done();
    });

    transformInstance.write(data);
    transformInstance.end();
  });
});
