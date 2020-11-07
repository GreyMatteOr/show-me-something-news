import { wordAPI } from '../api-requests.js';

describe( 'api helper functions', () => {

  describe( 'parseValues', () => {

    it( 'should return a String if a string is passed in', () => {

      expect(wordAPI.parseValues('foo')).toEqual('foo');
    });

    it( 'should return an array of strings if an Array is passed in', () => {

      let test = [undefined, null, 1, 'foo', () => {}, {}];
      let results = ['undefined', 'null', '1', 'foo', '()', '=>', '{}', '[object', 'Object]'];
      expect(wordAPI.parseValues(test)).toEqual(results)
    });

    it( 'should return an array of the values if an object is passed in', () => {

      let test = {1: 'foo', 2: 'bar', 3: 'debug'};
      let results = ['foo', 'bar', 'debug'];
      expect(wordAPI.parseValues(test)).toEqual(results)
    });

    it( 'should recurse over nested objects', () => {

      let test = {
        'one': {1: 'foo', 2: 'bar', 3: 'debug'},
        'two': {
          'iii': {
            1: 'in',
            2: 'too',
            3: 'deep'
          }
        },
        'three': [undefined, null, 1, 'foo', () => {}, {}]
      }
      let results = ['foo', 'bar', 'debug', 'in', 'too', 'deep', 'undefined', 'null', '1', 'foo', '()', '=>', '{}', '[object', 'Object]'];
      expect(wordAPI.parseValues(test)).toEqual(results)
    });
  });
});
