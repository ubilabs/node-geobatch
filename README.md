# node-geobatch

[![Build Status](https://travis-ci.org/ubilabs/node-geobatch.svg?branch=master)](https://travis-ci.org/ubilabs/node-geobatch) [![npm version](https://badge.fury.io/js/geobatch.svg)](http://badge.fury.io/js/geobatch)

[![forthebadge](http://forthebadge.com/images/badges/uses-badges.svg)](http://forthebadge.com)

Batch geocode addresses from multiple sources. It limits the calls to not run in `OVER_QUERY_LIMIT` by the Google Maps API. Results are cached locally to prevent duplicate geocoding requests.

## Usage

Install GeoBatch:

```sh
npm install geobatch --save
```

Then include and use it in your project:

```js
var GeoBatch = require('geobatch'),
  geoBatch = new GeoBatch();

geoBatch.geocode(['Hamburg', 'Berlin'])
  .on('data', function(data) {
    console.log('Geocode result', data);
  })
  .on('end', function() {
    console.log('Finished!');
  });
```

`geoBatch.geocode` also accepts a stream as input.

### Result

The data in the example above is an object like this:

```js
{
  error: null,
  address: 'Hamburg',
  input: 'Hamburg',
  location: { lat: 53.5510846, lng: 9.9936818 },
  result: {
    address_components: [ … ],
    formatted_address: 'Hamburg, Germany',
    geometry: {
      bounds: { northeast: [Object], southwest: [Object] },
      location: { lat: 53.5510846, lng: 9.9936818 },
      location_type: 'APPROXIMATE',
      viewport: { northeast: [Object], southwest: [Object] } },
      place_id: 'ChIJuRMYfoNhsUcRoDrWe_I9JgQ',
      types: [ 'locality', 'political' ]
    }
  },
  results: [{
    address_components: [ … ],
    formatted_address: 'Hamburg, Germany',
    geometry: {
      bounds: { northeast: [Object], southwest: [Object] },
      location: { lat: 53.5510846, lng: 9.9936818 },
      location_type: 'APPROXIMATE',
      viewport: { northeast: [Object], southwest: [Object] } },
      place_id: 'ChIJuRMYfoNhsUcRoDrWe_I9JgQ',
      types: [ 'locality', 'political' ]
    }]
  },
  total: 2,
  current: 1,
  pending: 1,
  percent: 50,
  estimatedDuration: 189
}
```

#### `error`

Type `string`. Contains the error message. Default `null`.

#### `address`

Type `string`. Contains the address that was put into the geocoder. Default `''`.

#### `input`

Contains the original input. This was the input to the accessor function to get the `address`.

#### `location`

Type `Object`. The coordinates returned from the Google Maps Geocoding API. Default `{}`.

#### `result`

Type `Object`. The complete first result item from the Google Maps Geocoding API. Default `{}`.

#### `results`

Type `Array`. The complete result from the Google Maps Geocoding API.

#### `total`

Type `Number`. The total number of addresses to geocode. (Not included if stream was provided.)

#### `current`

Type `Number`. The index of the current geocoded address.

#### `pending`

Type `Number`. The number of addresses to still geocode. (Not included if stream was provided.)

#### `percent`

Type `Number`. The percentage that got geocoded already. (Not included if stream was provided.)

#### `estimatedDuration`

Type `Number`. The estimated duration based on past progress. In milliseconds. (Not included if stream was provided.)

### Options

You can pass in options on initalization of the GeoBatch:

```js
new GeoBatch({
  clientId: 'myClientId',
  privateKey: 'myPrivateKey',
  apiKey: 'myApiKey',
  cacheFile: 'myGeocache.db',
  accessor: myAccessorFunction,
  maxRetries: 1,
  queriesPerSecond: 50
});
```

#### `clientId`

Type `String`. The Google Maps Client ID, if you are using Google for Work. If this is passed in, the `privateKey` is also required.
You must provide either a `clientId` and `privateKey`, or an `apiKey`. Default is `null`.

#### `privateKey`

Type `String`. The Google Maps private key, if you are using Google for Work. If this is passed in, the `clientId` is also required. Default is `null`.

#### `apiKey`

Type `String`. The Google Maps API key. If this is passed, neither `clientId` nor `privateKey` may be set.
You must provide either a `clientId` and `privateKey`, or an `apiKey`.
Default is `null`.

#### `cacheFile`

Type `String`. The path of the cache file, in which the geocoding responses are cached. Default is `geocache.db`.

#### `accessor`

Type `Function`. An accessor function that extracts the address data from the provided input. Defaults to:
```js
function(address) {
  return address;
}
```

#### `maxRetries`

Type `Number`. This option defines how often Geobatch will retry geocoding if the query limit was exceeded.
Default is `0`.

#### `queriesPerSecond`

Type `Number`. The maximum number of requests per second. This number must be between 1 and 50 (inclusive).
Please note that due to varying network latency the maximum value of 50 QPS will result in occasional `OVER_QUERY_LIMIT` errors.
Use a moderate value (the default is safe), or the `maxRetries` option.
Default is `35`.

## Contribution

**Make sure to follow the [Git Commit Conventions](https://github.com/ubilabs/node-geobatch/blob/master/CONVENTIONS.md)! Test and lint the code and adapt to the code style used in the project.**

Clone the repository and run:

```sh
npm install
```

To run the tests, run:

```
npm test
```

To make a release, run:

```
npm run release patch|minor|major
```

## License (MIT)

Copyright © 2015 Ubilabs GmbH

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the “Software”), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
