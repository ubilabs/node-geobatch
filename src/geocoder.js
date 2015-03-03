/**
 * Geocoder instance
 * @type {Function}
 * @param {Object} options The options for the Geocoder
 */
const Geocoder = function(options) {
  options = options || {};

  this.googlemaps = require('googlemaps');
};

/**
 * Geocode a single address
 * @param {String} address The address to geocode
 * @return {Promise} A new promise
 */
Geocoder.prototype.geocodeAddress = function(address) {
  address = address.replace('\'', '');

  return new Promise((resolve) => {
    this.googlemaps.geocode(address, (error, response) => {
      resolve(response.results[0].geometry.location);
    });
  });
};

module.exports = Geocoder;
