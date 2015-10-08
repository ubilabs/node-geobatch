import googleMaps from 'googlemaps';

export default class GoogleGeocoder {
  static init(config) {
    googleMaps.config('google-client-id', config.clientId);
    googleMaps.config('google-private-key', config.privateKey);
    return googleMaps;
  }
}
