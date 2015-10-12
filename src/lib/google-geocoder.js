import googleMaps from 'googlemaps';

export default class GoogleGeocoder {

  /**
   * Inits a google maps API instance with give clientID and privateKey.
   * @param  {Object}             Config Object
   * @return {Object}             Instance of google maps API
   */
  static init({clientId, privateKey} = {clientId: null, privateKey: null}) {
    googleMaps.config('google-client-id', clientId);
    googleMaps.config('google-private-key', privateKey);
    return googleMaps;
  }
}
