export const wordAPI = {
  url: 'https://wordsapiv1.p.rapidapi.com/words/',

  getRandomWord() {
    return fetch(wordAPI.url + '?random=true', {
      method: 'GET',
      headers: {
        "x-rapidapi-key": "7db29738cbmsh471ad5d986747b7p1cb45ajsnfd84ea900f54",
        "x-rapidapi-host": "wordsapiv1.p.rapidapi.com"
      }
    })
    .then( response => {
      if (response.ok) {
        return response.json();
      } else {
        return 'error';
      }
    });
  },

  async getPhrase(numWords, data = []) {
    let words = [];
    while (words.length < numWords) {
      let randomI = Math.floor( Math.random() * 10);
      while (data.length <= randomI) {
        let newData = await wordAPI.getRandomWord();
        if (newData === 'error') return 'error';
        data = data.concat( wordAPI.parseValues(newData) );
      }
      words.push( data[randomI] );
      data = data.slice(randomI + 1);
    }
    return words;
  },

  parseValues(data, type = typeof(data)) {

    if(data === undefined || data === null) return [];

    if (Array.isArray(data)) {
      return data.reduce( (output, element) => {
        return output.concat( wordAPI.parseValues(element) )
      }, []);
    }

    if (type === 'object') {
      let output = [];
      Object.entries(data).forEach( entry => {
        if (entry[0] !== 'pronunciation') output = output.concat(wordAPI.parseValues(entry[1]))
      });
      return output;
    }

    if (type === 'string') {
      return data.split(' ')
      .filter(word => {
        let tooShort = word.length <= 3;
        let isForbidden = [
          'adjective',
          'adverb',
          'article',
          'conjunction',
          'determiner',
          'interjection',
          'noun',
          'preposition',
          'pronoun',
          'verb'
        ];
        return !tooShort && !isForbidden.includes(word);
      });
    }
    return [];
  }
}

export const timesAPI = {
  url: 'https://api.nytimes.com/svc/search/v2/articlesearch.json?',

  key: '&api-key=L5x1jxc7BGK5GdsesCTan33ncRlP52P6',

  getArticles(query, page = 0, sort = 'relevance') {
    return fetch(timesAPI.url + `q=${query}` + timesAPI.key + `&page=${page}` + `&sort=${sort}`)
    .then( response => {
      if (response.ok) {
        return response.json();
      } else {
        return 'error';
      }
    });
  }
}
