### 1.0.2 (2015-03-10)


#### Bug Fixes

* **all:** switch from traceur to babel for ES6 ([b882beeb](https://github.com/ubilabs/node-geobatch/commit/b882beeb349a157541d1f558385a74e79a3d2a00))


### 1.0.1 (2015-03-09)


## 1.0.0 (2015-03-09)


#### Features

* **cache:**
  * add and get values ([6027eca2](https://github.com/ubilabs/node-geobatch/commit/6027eca2df807de1623fe3ca8d99f2ddcdcd461e))
  * add simple cache ([513a7201](https://github.com/ubilabs/node-geobatch/commit/513a72012bd7a5150b45bdf6f575c178381c7dc1))
* **geocoder:**
  * limit API calls according to not run in query limits ([924763ca](https://github.com/ubilabs/node-geobatch/commit/924763ca6a4ea1ffef80a463f56e7eb901422428))
  * return error when reaching query limit ([6e1f66d8](https://github.com/ubilabs/node-geobatch/commit/6e1f66d87cea1cb6e4f929dec480cdf28c5e37d9))
  * catch case when no result is returned ([dc13cdc7](https://github.com/ubilabs/node-geobatch/commit/dc13cdc76383dfd439dd963adcee3254e0630446))
  * return error when not using correct clientId or privateKey ([2d338606](https://github.com/ubilabs/node-geobatch/commit/2d338606e9899b681d26f02073fc2f126354cf9c))
  * reject geocode when not correct clientId or privateKey ([5050f491](https://github.com/ubilabs/node-geobatch/commit/5050f4910996280c3d40cf40d18acf8b8c751031))
  * accept a clientId and privateKey ([06606a36](https://github.com/ubilabs/node-geobatch/commit/06606a366d6c2942e325a38ff6ddcd9d932e1f9c))
  * catch missing clientId or privateKey ([cd498177](https://github.com/ubilabs/node-geobatch/commit/cd498177e76687adc527ac9ecd66aa2b0fd93c48))
  * use cached geocoded addresses ([6958072d](https://github.com/ubilabs/node-geobatch/commit/6958072dadaa910572930c1fe2131d1c5b9ff228))
  * cache geocode requests ([adc98fba](https://github.com/ubilabs/node-geobatch/commit/adc98fba62be1df7fe8c03c8426e182d6d879f5d))
  * geocode an address ([e392d6e3](https://github.com/ubilabs/node-geobatch/commit/e392d6e37fbdebb6bbbeb4a5b2dd9a12ff529429))
  * add basic class ([99f04f9b](https://github.com/ubilabs/node-geobatch/commit/99f04f9badce7d113787c2925b3b761bd121167a))
* **index:**
  * return an empty object on error for location ([3adab5a2](https://github.com/ubilabs/node-geobatch/commit/3adab5a25fe393ed9ea8146196d331cd895e109e))
  * return an error when geocoding fails ([ffc6c23a](https://github.com/ubilabs/node-geobatch/commit/ffc6c23a12c51ebb563606ee8032ecc8595ccd6b))
  * return some meta information on each geocode ([2362b583](https://github.com/ubilabs/node-geobatch/commit/2362b5837501dc260b2346d3d169cac5e7a8b3af))
  * improve and simplify API ([c7dcb256](https://github.com/ubilabs/node-geobatch/commit/c7dcb256c12523ad7e092113e6291cacedce4126))
  * accept and return a stream ([3821ba7b](https://github.com/ubilabs/node-geobatch/commit/3821ba7b2088a2553c4a43e69eabb0cc3ffb9696))
  * return an object with address and location ([e14b773a](https://github.com/ubilabs/node-geobatch/commit/e14b773a7bf904e2810dc207709c8f88acc59760))
  * return an geocoded object via stream ([74dca152](https://github.com/ubilabs/node-geobatch/commit/74dca1525f3303216cae68145212a746e52ac162))
  * use simpler stream implementation ([5aa1fd39](https://github.com/ubilabs/node-geobatch/commit/5aa1fd39590b24c5aa8b703602f39398c0260473))
  * return a stream when calling geocode function ([0a80444b](https://github.com/ubilabs/node-geobatch/commit/0a80444b2b62cae56a6faf4dd20021138c7bde67))
  * add a function geocode ([8d98cb2b](https://github.com/ubilabs/node-geobatch/commit/8d98cb2b3641063432223be1e696f1c7e37ef0d5))
  * accept clientId and privateKey ([a46c16b9](https://github.com/ubilabs/node-geobatch/commit/a46c16b94656b90a1716c6288f6ab8a89a79660e))
  * accept cacheFile param ([33da3c9d](https://github.com/ubilabs/node-geobatch/commit/33da3c9da45b9cee4ed149817d500d1619e5acb6))

