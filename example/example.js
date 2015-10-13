import GeoBatch from '../src/index';

const accessor = input => input.address,
  input = [
    {
      address: 'Hamburg'
    },
    {
      address: 'Berlin'
    }
  ],
  geoBatch = new GeoBatch({accessor});

geoBatch.geocode(input)
  .on('data', result => {
    console.log(result); // eslint-disable-line
  });
