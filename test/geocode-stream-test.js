/* eslint-disable no-unused-expressions, max-nested-callbacks */
import sinon from 'sinon';
import should from 'should';
import GeocodeStream from '../src/geocode-stream';
import stream from 'stream';
import Promise from 'lie';
import {getGeocoderInterface} from './lib/helpers';

describe('Geocode Stream', () => {
  it('be of tyope stream.Transform', () => {
    const geocodeStream = new GeocodeStream();
    should(geocodeStream).be.an.instanceof(stream.Transform);
  });

  it('have a _transform function', () => {
    const geocodeStream = new GeocodeStream();
    should(geocodeStream._transform).be.a.Function;
  });

  it('should take a geocoder', () => {
    const mockGeocoder = 'a geocoder',
      geocodeStream = new GeocodeStream(mockGeocoder);
    should(geocodeStream.geocoder).be.equal(mockGeocoder);
  });

  it('should take stats', () => {
    const mockStats = 'some stats',
      geocodeStream = new GeocodeStream(null, mockStats);
    should(geocodeStream.stats).be.equal(mockStats);
  });

  describe('_transform should', () => {
    it('send an address to the geocoder', done => {
      const promise = Promise.resolve(),
        newGeocodeAddressFunction = sinon.stub().returns(promise),
        GeoCoderInterface = getGeocoderInterface(
          null,
          newGeocodeAddressFunction
        ),
        geocoder = GeoCoderInterface.init(),
        geocodeStream = new GeocodeStream(geocoder);

      geocodeStream._transform('test', null, null);
      promise
        .then(() => {
          sinon.assert.calledWith(newGeocodeAddressFunction, 'test');
          done();
        })
        .catch(error => {
          done(error);
        });

    });

    it('call the \'done\' function when finishes succesfully', done => {
      const promise = Promise.resolve({geometry: {location: null}}),
        newGeocodeAddressFunction = () => promise,
        GeoCoderInterface = getGeocoderInterface(
          null,
          newGeocodeAddressFunction
        ),
        geocoder = GeoCoderInterface.init(),
        mockStats = {
          current: 0,
          total: 0,
          startTime: new Date()
        },
        geocodeStream = new GeocodeStream(geocoder, mockStats);
      const doneFunction = sinon.stub();

      geocodeStream._transform('test2', null, doneFunction);
      promise
        .then(() => {
          sinon.assert.called(doneFunction);
          done();
        })
        .catch(error => {
          done(error);
        });

    });


    // it('call the \'done\' function when finishes with error^', done => {
    //   const promise = Promise.reject(new Error('error')),
    //     newGeocodeAddressFunction = () => promise,
    //     GeoCoderInterface = getGeocoderInterface(
    //       null,
    //       newGeocodeAddressFunction
    //     ),
    //     geocoder = GeoCoderInterface.init(),
    //     mockStats = {
    //       current: 0,
    //       total: 0,
    //       startTime: new Date()
    //     },
    //     geocodeStream = new GeocodeStream(geocoder, mockStats);
    //   const doneFunction = sinon.stub();
    //
    //   geocodeStream._transform('test2', null, doneFunction);
    //   promise
    //     .then(() => {
    //       sinon.assert.called(doneFunction);
    //       done();
    //     })
    //     .catch(error => {
    //       done(error);
    //     });
    //
    // });

  });

});
/* eslint-enable */
