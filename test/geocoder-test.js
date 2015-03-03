/* eslint-disable no-unused-expressions */
require('traceur-runner');

var should = require('should'),
  Geocoder = require('../src/geocoder.js');

describe('Testing geocoder', function() {
  it('should create a new instance when called without params', function() {
    var geocoder = new Geocoder();

    should.exist(geocoder);
  });
});
