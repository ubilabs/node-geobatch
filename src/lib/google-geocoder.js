import googleMaps from 'googlemaps';

export default class GoogleGeocoder {
  static init({clientId, privateKey} = {clientId: null, privateKey: null}) {
    googleMaps.config('google-client-id', clientId);
    googleMaps.config('google-private-key', privateKey);
    return googleMaps;
  }
}
