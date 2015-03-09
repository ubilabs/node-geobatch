# node-geobatch

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

### Options

You can pass in options on initalization of the GeoBatch:

```js
new GeoBatch({
  clientId: 'myClientId',
  privateKey: 'myPrivateKey',
  cacheFile: 'myGeocache.db'
});
```

#### `clientId`

Type `String`. The Google Maps Client ID, if you are using Google for Work. If this is passed in, the `privateKey` is also required. Default is `null`.

#### `privateKey`

Type `String`. The Google Maps private key, if you are using Google for Work. If this is passed in, the `clientId` is also required. Default is `null`.

#### `cacheFile`

Type `String`. The path of the cache file, in which the geocoding responses are cached. Default is `geocache.db`.

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


## License (MIT)

Copyright © 2015 Ubilabs GmbH

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the “Software”), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
