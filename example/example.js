import Geobatch from '../src/index';

const accessor = input => input.address,
  gb = new Geobatch({}, accessor),
  input = [
    {
      address: 'Hamburg'
    },
    {
      address: 'Berlin'
    }
  ],
  s = gb.geocode(input);

s.on('data', result => {
  console.log(result);
});
