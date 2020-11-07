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

  describe( 'getPhrase', () => {

    beforeEach( () => {
      wordAPI.getRandomWord = jest.fn().mockResolvedValue({1:'foo'});
    })

    it( 'should call `getRandomWord` at least once', async () => {

      await wordAPI.getPhrase(1, 1);
      expect(wordAPI.getRandomWord).toBeCalled();
    });

    it( 'should return an array of words', async () => {

      let test = await wordAPI.getPhrase(1, 1);
      expect(test).toEqual(['foo']);
    });

    it( 'should work for any number of words', async () => {

      let test = await wordAPI.getPhrase(1, 1);
      expect(test).toEqual(['foo']);

      test = await wordAPI.getPhrase(2, 2);
      expect(test).toEqual(['foo', 'foo']);

      test = await wordAPI.getPhrase(3, 3);
      expect(test).toEqual(['foo', 'foo', 'foo']);

      test = await wordAPI.getPhrase(4, 4);
      expect(test).toEqual(['foo', 'foo', 'foo', 'foo']);

      test = await wordAPI.getPhrase(5, 5);
      expect(test).toEqual(['foo', 'foo', 'foo', 'foo', 'foo']);

    });

    it( 'should work for more complicated data structures', async () => {

      wordAPI.getRandomWord = jest.fn().mockResolvedValue(
        {
          1:'foo',
          2: 'bar',
          3: {
            4: 'debug',
            5: ['loo', 'baz', 'snup'],
            6: {
              7: 'can',
              8: 'I',
              9: 'do',
              10: 'it?'
            }
          }
        }
      );

      let correct = ['foo', 'bar', 'debug', 'loo', 'baz', 'snup', 'can', 'I', 'do', 'it?'];

      for (let i = 0; i < 20; i++) {
        let result = await wordAPI.getPhrase(5, 5);

        let test = result.every( word => correct.includes( word));
        expect(test).toEqual(true);
      }

    })
  });
});
