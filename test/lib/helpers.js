import sinon from 'sinon';
import GeocodeStream from '../../src/geocode-stream';

/**
 * Returns a geocode function to be used in the geocoder.
 * @param  {Object} status The status of the geocode repsonse
 * @param  {Object} results The results of the geocode response
 * @param  {Object} error  The error message of the geocode response
 * @return {Function}         A stubbed function that calls the second argument
 *                              as a callback.
 */
const helpers = {
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

  getGeocodeStream: geocoderPromise => {
    const newGeocodeAddressFunction = () => geocoderPromise,
      GeoCoderInterface = helpers.getGeocoderInterface(
        null,
        newGeocodeAddressFunction
      ),
      geocoder = GeoCoderInterface.init(),
      mockStats = {
        current: 0,
        total: 0,
        startTime: new Date()
      };
    return new GeocodeStream(geocoder, mockStats);
  }
};

export default helpers;
