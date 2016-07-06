import sinon from 'sinon';
import GeocodeStream from '../../src/geocode-stream';

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
   * @return {Object}                 A geocoder interface object.
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
      queriesPerSecond: 35
    };

    return Object.assign({}, defaultOptions, opts);
  },

  /**
   * Returns a mock geocoderStream.
   * @param  {Promise} geocoderPromise The geocode promise returned by the
   *                                   geocoder.
   * @return {Stream} A mock geocoder stream.-
   */
  getGeocodeStream: geocoderPromise => {
    const mockGeocodeAddressFunction = () => geocoderPromise,
      GeoCoderInterface = helpers.getGeocoderInterface(
        null,
        mockGeocodeAddressFunction
      ),
      mockGeocoder = GeoCoderInterface.init(),
      mockStats = {};
    return new GeocodeStream(mockGeocoder, mockStats);
  }
};

export default helpers;
