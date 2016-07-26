import GoogleMapsAPI from 'googlemaps';

const defaults = {
  google_client_id: null, // eslint-disable-line camelcase
  google_private_key: null, // eslint-disable-line camelcase
  key: null
};

export default class GoogleGeocoder {

  /**
   * Inits a google maps API instance with give clientID and privateKey.
   * @param  {Object} options     Config Object
   * @return {Object}             Instance of google maps API
   */
  static init(options = {}) {
    options = Object.assign({}, defaults, options);
    return new GoogleMapsAPI(options);
  }
}
