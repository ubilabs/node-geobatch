/* eslint-disable no-unused-expressions, one-var */
require('traceur-runner');

const should = require('should'),
  fs = require('fs'),
  GeoBatch = require('../src/index.js');

describe('Testing index', function() {
  afterEach(function(done) {
    fs.exists('geocache.db', function(exists) {
      if (exists) {
        fs.unlinkSync('geocache.db');
      }

      setTimeout(done, 500);
    });
  });

  it('should create a new instance when called without params', function() {
    const geoBatch = new GeoBatch();

    should.exist(geoBatch);
  });

  it('should accept a cachefile name', function(done) {
    const geoBatch = new GeoBatch({
      cacheFile: 'myPersonalGeocache.db'
    });

    should.exist(geoBatch);

    fs.exists('myPersonalGeocache.db', function(exists) {
      should(exists).be.true;
      fs.unlinkSync('myPersonalGeocache.db');
      done();
    });
  });

  it('should accept a clientId and a privateKey', function() {
    /* eslint-disable no-unused-vars */
    should(function() {
      const geoBatch = new GeoBatch({
        privateKey: 'dummy'
      });
    }).throw('Missing clientId');

    should(function() {
      const geoBatch = new GeoBatch({
        clientId: 'dummy'
      });
    }).throw('Missing privateKey');
    /* eslint-enable no-unused-vars */
  });

  it('should have a geocode function that accepts and returns a stream',
    function(done) {
      const geoBatch = new GeoBatch();

      should(geoBatch.geocode).be.a.Function;

      geoBatch.geocode([])
        .on('data', function() {})
        .on('end', function() {
          done();
        });
    }
  );

  it('should geocode addresses',
    function(done) {
      const geoBatch = new GeoBatch();

      let geocodeResponses = 0,
        found = {
          Hamburg: false,
          Berlin: false
        };

      geoBatch.geocode(['Hamburg', 'Berlin'])
        .on('data', function(data) {
          should(data).be.an.Object;
          should(data.address).be.a.String;
          should(data.location).be.an.Object;
          should(data.location.lat).be.a.Number;
          should(data.location.lng).be.a.Number;
          should(data.error).be.null;
          found[data.address] = true;
          geocodeResponses++;
        })
        .on('end', function() {
          should.equal(geocodeResponses, 2);
          should(found.Hamburg).be.true;
          should(found.Berlin).be.true;
          done();
        });
    }
  );

  it('should return an error when geocoding of addresses fails',
    function(done) {
      const geoBatch = new GeoBatch();

      geoBatch.geocode(['My dummy location that does not exist!'])
        .on('data', function(data) {
          should(data.error).be.a.String;
          should(data.error).equal('No results found');
        })
        .on('end', function() {
          done();
        });
    }
  );

  it('should return some info about the geocoding process',
    function(done) {
      const geoBatch = new GeoBatch();

      geoBatch.geocode(['Hamburg', 'Berlin'])
        .on('data', function(data) {
          should(data.pending).be.a.Number;
          should(data.total).be.a.Number;
          should(data.current).be.a.Number;
          should(data.percent).be.a.Number;
          should(data.estimatedDuration).be.a.Number;
          should(data.total).equal(2);
          should(data.estimatedDuration).not.equal(0);
          if (data.address === 'Hamburg') {
            should(data.pending).equal(1);
            should(data.current).equal(1);
            should(data.percent).equal(50);
          }
          if (data.address === 'Berlin') {
            should(data.pending).equal(0);
            should(data.current).equal(2);
            should(data.percent).equal(100);
          }
        })
        .on('end', function() {
          done();
        });
    }
  );

  it('should handle multiple calls to geocode',
    function(done) {
      const geoBatch = new GeoBatch();

      let finishedCalls = 0;

      geoBatch.geocode(['Hamburg'])
        .on('data', function(data) {
          should(data.address).equal('Hamburg');
        })
        .on('end', function() {
          finishedCalls++;

          if (finishedCalls === 3) {
            done();
          }
        });

      geoBatch.geocode(['Munich'])
        .on('data', function(data) {
          should(data.address).equal('Munich');
        })
        .on('end', function() {
          finishedCalls++;

          if (finishedCalls === 3) {
            done();
          }
        });

      geoBatch.geocode(['Leipzig'])
        .on('data', function(data) {
          should(data.address).equal('Leipzig');
        })
        .on('end', function() {
          finishedCalls++;

          if (finishedCalls === 3) {
            done();
          }
        });
    }
  );

  it('should limit the geocoding calls to not run into API limits',
    function(done) {
      const geoBatch = new GeoBatch();

      this.timeout(15000);

      geoBatch.geocode([
        'Hamburg', 'Berlin', 'Leipzig', 'Stuttgart', 'Munich', 'Cologne',
        'Bremen', 'Rostock', 'Freiburg', 'Frankfurt', 'Dresden', 'Karlsruhe',
        'Halle', 'Flensburg', 'Dortmund', 'Ulm', 'Kiel', 'Erlangen', 'Moskau',
        'New York', 'Rio de Janeiro', 'Tokyo', 'Lima', 'Quito', 'Montevideo'
      ])
        .on('data', function(data) {
          should(data.error).be.null;
          should(data.location).be.an.Object;
        })
        .on('end', function() {
          done();
        });
    }
  );
});
