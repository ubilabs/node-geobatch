import sinon from 'sinon';
import GeocodeStream from '../../src/geocode-stream';
import ParallelTransform from '../../src/lib/parallel-transform';
import defaults from '../../src/defaults';

const helpers = {
  /**
   * Returns a geocode function to be used in the geocoder.
   * @param  {Object} status The status of the geocode repsonse
   * @param  {Object} results The results of the geocode response
   * @param  {Object} error  The error message of the geocode response
   * @return {Function}        A stubbed function that calls the second argument
   *                              as a callback.
   */
  getGeocodeFunction: ({status = '', results = '', error = ''}
      = {status: '', results: '', error: ''}) => {
    const geoCoderReponseObject = {
      status,
      results
    };
    return sinon.stub()
      .callsArgWith(1, error, geoCoderReponseObject);
  },

  /**
   * Returns a geocoder interface. The init function returns a geocoder that
   * exposes a geocode function.
   * @param  {Function} geocodeFunction The geocode function to be exposed.
   * @param  {Function} geocodeAddressFunction The geocodeAddress function
                                               to be exposed
   * @return {Object}                   A geocoder interface object.
   */
  getGeocoderInterface: (
    geocodeFunction = () => {},
    geocodeAddressFunction = () => {}
  ) => {
    let geoCoderInterface = {init: () => {
      return {
        geocode: geocodeFunction,
        geocodeAddress: geocodeAddressFunction
      };
    }};
    return geoCoderInterface;
  },

  /**
   * Returns an options object for the Geocoder constructor with
   * required default options added
   * @param  {Object} opts desired extra options
   * @return {Object}      input options, with added default options
   */
  getGeocoderOptions: opts => {
    const defaultOptions = {
      cacheFile: 'geocache.db',
      clientId: null,
      privateKey: null,
      apiKey: 'dummy',
      maxRetries: 0,
      queriesPerSecond: defaults.defaultQueriesPerSecond
    };

    return Object.assign({}, defaultOptions, opts);
  },

  /**
   * Returns a mock geocoderStream.
   * @param  {Promise} geocoderPromise The geocode promise returned by the
   *                                   geocoder.
   * @param  {Number} queriesPerSecond The queries per second
   * @return {Stream} A mock geocoder stream.-
   */
  getGeocodeStream: (
    geocoderPromise,
    queriesPerSecond = defaults.defaultQueriesPerSecond
  ) => {
    const mockGeocodeAddressFunction = () => geocoderPromise,
      GeoCoderInterface = helpers.getGeocoderInterface(
        null,
        mockGeocodeAddressFunction
      ),
      mockGeocoder = GeoCoderInterface.init(),
      mockStats = {};
    return new GeocodeStream(mockGeocoder, queriesPerSecond, mockStats);
  },

  /**
   * Returns a mock ParallelTransform stream
   * @param {Function} parallelTransform The transformation function
   * @param {Number}   maxParallel The maximum number of
                                   parallel transformations
   * @param {Object}   options ParallelTransform options
   * @return {Stream} A ParallelTransform stream
   **/
  getParallelTransformStream: (
    parallelTransform = (data, done) => {
      done(null, data);
    },
    maxParallel = 1,
    options = {}
  ) => {
    class TransformTestClass extends ParallelTransform {
      constructor() {
        super(maxParallel, options);
      }
    }

    TransformTestClass.prototype // eslint-disable-line no-underscore-dangle
      ._parallelTransform = parallelTransform;

    return TransformTestClass;
  }
};

export default helpers;
