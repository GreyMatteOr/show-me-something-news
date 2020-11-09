import { wordAPI } from '../api-requests.js';

describe( 'api helper functions', () => {

  describe( 'parseValues', () => {

    it( 'should return an array with a String if a string is passed in', () => {

      expect(wordAPI.parseValues('foobar')).toEqual(['foobar']);
    });

    it( 'should split string up into words', () => {

      expect(wordAPI.parseValues('foobar doobar')).toEqual(['foobar', 'doobar']);
    });

    it( 'should remove all words that are less than 3 letters', () => {

      expect(wordAPI.parseValues('foo bar doobar')).toEqual(['doobar']);
    });

    it( 'should remove all forbidden words', () => {

      expect(wordAPI.parseValues('noud noun adject article')).toEqual(['noud', 'adject']);
    });

    it( 'should return an array of strings if an Array is passed in', () => {

      let test = [undefined, null, 1, 'foobar', () => {}, {}];
      let results = ['foobar'];
      expect(wordAPI.parseValues(test)).toEqual(results);
    });

    it( 'should return an array of the values if an object is passed in', () => {

      let test = {1: 'fool', 2: 'barn', 3: 'debug'};
      let results = ['fool', 'barn', 'debug'];
      expect(wordAPI.parseValues(test)).toEqual(results);
    });

    it( 'should recurse over nested objects', () => {

      let test = {
        'one': {1: 'fool', 2: 'barn', 3: 'debug'},
        'two': {
          'iii': {
            1: 'in',
            2: 'took',
            3: 'deep'
          }
        },
        'three': [undefined, null, 1, 'foo', () => {}, {}]
      }
      let results = ['fool', 'barn', 'debug', 'took', 'deep'];
      expect(wordAPI.parseValues(test)).toEqual(results)
    });
  });

  describe( 'getPhrase', () => {

    beforeEach( () => {
      wordAPI.getRandomWord = jest.fn().mockResolvedValue({1:'fool'});
    })

    it( 'should call `getRandomWord` at least once', async () => {

      await wordAPI.getPhrase(1, 1);
      expect(wordAPI.getRandomWord).toBeCalled();
    });

    it( 'should return an array of words', async () => {

      let test = await wordAPI.getPhrase(1, 1);
      expect(test).toEqual(['fool']);
    });

    it( 'should work for any number of words', async () => {

      let test = await wordAPI.getPhrase(1, 1);
      expect(test).toEqual(['fool']);

      test = await wordAPI.getPhrase(2, 2);
      expect(test).toEqual(['fool', 'fool']);

      test = await wordAPI.getPhrase(3, 3);
      expect(test).toEqual(['fool', 'fool', 'fool']);

      test = await wordAPI.getPhrase(4, 4);
      expect(test).toEqual(['fool', 'fool', 'fool', 'fool']);

      test = await wordAPI.getPhrase(5, 5);
      expect(test).toEqual(['fool', 'fool', 'fool', 'fool', 'fool']);

    });

    it( 'should work for more complicated data structures', async () => {

      wordAPI.getRandomWord = jest.fn().mockResolvedValue(
        {
          1:'fool',
          2: 'barn',
          3: {
            4: 'debug',
            5: ['loop', 'baz', 'snup'],
            6: {
              7: 'cant',
              8: 'I',
              9: 'do',
              10: 'it?'
            }
          }
        }
      );

      let correct = ['fool', 'barn', 'debug', 'loop', 'snup', 'cant'];

      for (let i = 0; i < 20; i++) {
        let result = await wordAPI.getPhrase(5, 5);

        let test = result.every( word => correct.includes( word));
        expect(test).toEqual(true);
      }

    })
  });
});
