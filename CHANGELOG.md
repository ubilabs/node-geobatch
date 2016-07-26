<a name="1.4.3"></a>
## [1.4.3](https://github.com/ubilabs/node-geobatch/compare/1.4.2...v1.4.3) (2016-07-26)


### Bug Fixes

* **geocode-stream:** ensure sequential 'current' field ([7be819d](https://github.com/ubilabs/node-geobatch/commit/7be819d))
* **geocoder:** use correct client ID / private key parameter ([2d72860](https://github.com/ubilabs/node-geobatch/commit/2d72860))



<a name="1.4.2"></a>
## [1.4.2](https://github.com/ubilabs/node-geobatch/compare/1.4.1...v1.4.2) (2016-07-14)


### Bug Fixes

* **geocode-stream:** fix a bug with low QPS limits ([48fe3fd](https://github.com/ubilabs/node-geobatch/commit/48fe3fd))


### 1.4.1 (2016-07-07)


## 1.4.0 (2016-07-07)


#### Features

* **geobatch:**
  * add `maxRetries` option ([3df0a6ab](https://github.com/ubilabs/node-geobatch/commit/3df0a6abaa703e0135b76294b56c2006ad8ae534))
  * add an option to specify QPS ([1782a232](https://github.com/ubilabs/node-geobatch/commit/1782a232388330370a4fd01695e191215a1d36b6))
* **geocoder:**
  * retry once after running into query limit ([d776d830](https://github.com/ubilabs/node-geobatch/commit/d776d83000258e8a50811b73ac1099a449ff129d))
  * implement parallel processing to leverage full QPS ([bd97c519](https://github.com/ubilabs/node-geobatch/commit/bd97c5195fb20f7cf76128ff50e48f535046bb82))


## 1.3.0 (2016-06-28)


#### Bug Fixes

* **geocoder:**
  * require api key or client id / private key option ([6790293d](https://github.com/ubilabs/node-geobatch/commit/6790293d9180d24f744f50792600ce77737d7d5a))
  * increase queries per second when authenticated ([3acceafe](https://github.com/ubilabs/node-geobatch/commit/3acceafe479cd6617e355f0506d285108c09fb4a))
  * return correct error messages ([90f09bbc](https://github.com/ubilabs/node-geobatch/commit/90f09bbc5f7040ad1e1148f71007ce99e726f162))
* **npm-scripts:** remove `./node_modules/.bin/` from modules call ([bab003df](https://github.com/ubilabs/node-geobatch/commit/bab003df3c0d22a8e891d960e8cf44e020349264))
* **test:** use babel-core as mocha compilers plugin for testing ([54063f16](https://github.com/ubilabs/node-geobatch/commit/54063f1609e34c2fc25580cb77ba31486656a674))
* **tests:** fix rebase bug ([d5a58e14](https://github.com/ubilabs/node-geobatch/commit/d5a58e14ee0943b5fefec7f4756bd11d4cb6338a))


#### Features

* **GeoBatch:** make geocode accept streams ([0a032e74](https://github.com/ubilabs/node-geobatch/commit/0a032e74b3f1655ce7f5bec09461efdc46a3cc42))
* **geobatch:** take accessor function for address ([7588f2ca](https://github.com/ubilabs/node-geobatch/commit/7588f2ca9e3eb23c40506b658a8be6ff910adaa1))
* **geocode stream:** handle stats if input is stream ([f2cdbd89](https://github.com/ubilabs/node-geobatch/commit/f2cdbd892bd48c1294237a18ec56ff0dbaa8187c))
* **geocoder:**
  * allow authentication via api key ([c175b492](https://github.com/ubilabs/node-geobatch/commit/c175b492ac2578a145f8441db760de37d748cde6))
  * return full geocoding result ([ec20a890](https://github.com/ubilabs/node-geobatch/commit/ec20a8908cfec55c8ec50dfe11b2265649bebee2))
* **geocodestream:** add full input and full result to output stream ([9bd0630c](https://github.com/ubilabs/node-geobatch/commit/9bd0630cd2910695725f0aa954d0871ef2b5622e))


## 1.2.0 (2015-10-13)


### 1.1.1 (2015-10-13)


#### Bug Fixes

* **npm-scripts:** remove `./node_modules/.bin/` from modules call ([bab003df](https://github.com/ubilabs/node-geobatch/commit/bab003df3c0d22a8e891d960e8cf44e020349264))
* **test:** use babel-core as mocha compilers plugin for testing ([54063f16](https://github.com/ubilabs/node-geobatch/commit/54063f1609e34c2fc25580cb77ba31486656a674))
* **tests:** fix rebase bug ([d5a58e14](https://github.com/ubilabs/node-geobatch/commit/d5a58e14ee0943b5fefec7f4756bd11d4cb6338a))


#### Features

* **GeoBatch:** make geocode accept streams ([0a032e74](https://github.com/ubilabs/node-geobatch/commit/0a032e74b3f1655ce7f5bec09461efdc46a3cc42))
* **geobatch:** take accessor function for address ([7588f2ca](https://github.com/ubilabs/node-geobatch/commit/7588f2ca9e3eb23c40506b658a8be6ff910adaa1))
* **geocode stream:** handle stats if input is stream ([f2cdbd89](https://github.com/ubilabs/node-geobatch/commit/f2cdbd892bd48c1294237a18ec56ff0dbaa8187c))
* **geocoder:** return full geocoding result ([ec20a890](https://github.com/ubilabs/node-geobatch/commit/ec20a8908cfec55c8ec50dfe11b2265649bebee2))
* **geocodestream:** add full input and full result to output stream ([9bd0630c](https://github.com/ubilabs/node-geobatch/commit/9bd0630cd2910695725f0aa954d0871ef2b5622e))


## 1.1.0 (2015-10-13)


#### Bug Fixes

* **npm-scripts:** remove `./node_modules/.bin/` from modules call ([bab003df](https://github.com/ubilabs/node-geobatch/commit/bab003df3c0d22a8e891d960e8cf44e020349264))
* **test:** use babel-core as mocha compilers plugin for testing ([54063f16](https://github.com/ubilabs/node-geobatch/commit/54063f1609e34c2fc25580cb77ba31486656a674))
* **tests:** fix rebase bug ([d5a58e14](https://github.com/ubilabs/node-geobatch/commit/d5a58e14ee0943b5fefec7f4756bd11d4cb6338a))


#### Features

* **GeoBatch:** make geocode accept streams ([0a032e74](https://github.com/ubilabs/node-geobatch/commit/0a032e74b3f1655ce7f5bec09461efdc46a3cc42))
* **geobatch:** take accessor function for address ([7588f2ca](https://github.com/ubilabs/node-geobatch/commit/7588f2ca9e3eb23c40506b658a8be6ff910adaa1))
* **geocode stream:** handle stats if input is stream ([f2cdbd89](https://github.com/ubilabs/node-geobatch/commit/f2cdbd892bd48c1294237a18ec56ff0dbaa8187c))
* **geocoder:** return full geocoding result ([ec20a890](https://github.com/ubilabs/node-geobatch/commit/ec20a8908cfec55c8ec50dfe11b2265649bebee2))
* **geocodestream:** add full input and full result to output stream ([9bd0630c](https://github.com/ubilabs/node-geobatch/commit/9bd0630cd2910695725f0aa954d0871ef2b5622e))


## 1.1.0 (2015-03-10)


#### Bug Fixes

* **geocoder:**
  * do not change address ([f16f9e4f](https://github.com/ubilabs/node-geobatch/commit/f16f9e4f97ee4484d954f8570b6eb4dbe851eda3))
  * do not manipulate original address ([e0d1eca0](https://github.com/ubilabs/node-geobatch/commit/e0d1eca0b8c8e5d2fc70f784ac5fca28eaf21177))


#### Features

* **cache:** remove default values for location and address ([58c27aa2](https://github.com/ubilabs/node-geobatch/commit/58c27aa2b8950bb9ca8c258b1f0005255db7e1c8))
* **geocoder:** check cache repeatedly before geocoding requests ([35baec7b](https://github.com/ubilabs/node-geobatch/commit/35baec7bdc3c3fcaafca0fb95fe93572822dd017))
* **index:**
  * also return complete Maps API result on geocode ([87407bc0](https://github.com/ubilabs/node-geobatch/commit/87407bc0c9b32929f0e686b8a0fec244bb002f20))
  * return complete Google Maps geocoding result ([4efe2c44](https://github.com/ubilabs/node-geobatch/commit/4efe2c44596a7fa199473631a65620385127370a))


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

