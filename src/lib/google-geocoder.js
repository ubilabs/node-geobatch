import GoogleMapsAPI from 'googlemaps';

const defaults = {
  clientId: null,
  privateKey: null,
  key: null
};

export default class GoogleGeocoder {

  /**
   * Inits a google maps API instance with give clientID and privateKey.
   * @param  {Object}             Config Object
   * @return {Object}             Instance of google maps API
   */
  static init(options = {}) {
    options = Object.assign({}, defaults, options);
    return new GoogleMapsAPI(options);
  }
}
