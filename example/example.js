import Geobatch from '../src/index';

const accessor = input => input.address,
  input = [
    {
      address: 'Hamburg'
    },
    {
      address: 'Berlin'
    }
  ],
  gb = new Geobatch({}, accessor),
  resultStream = gb.geocode(input);

resultStream.on('data', result => {
  console.log(result); // eslint-disable-line
});
