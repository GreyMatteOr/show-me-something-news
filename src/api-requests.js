export const wordAPI = {
  url: 'https://wordsapiv1.p.rapidapi.com/words/',

  getRandomWord() {
    return fetch(url + '?random=true', {
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

  async getPhrase(min, max, numWords, words = []) {
    if (numWords === undefined) {
      let range = (max + .99) - min
      let rand =  Math.floor( Math.random() * range );
      let numWords = min + rand;
    }
    if (words.length === 0) {
      data = await wordAPI.getRandomWord();
      if (data = 'error') return 'error';
      words = parseValues(data);
    }
    let randomI = Math.floor( Math.random() * words.length);
    let randomWord = [words[randomI]];
    restOfWords = words.slice(randomI + 1);
    return randomWord.concat(min, max, numWords - 1, restOfWords);
  },

  parseValues(data, type = typeof(data)) {
    if (Array.isArray(data)) {
      return data.reduce( (output, element) => output.concat( String(element).split(' ') ), []);
    }
    if (type === 'object') {
      let output = [];
      Object.values(data).forEach( value => output = output.concat(wordAPI.parseValues(value)));
      return output;
    }
    if (type === 'string') return data;
    return [];
  }
}

export const timesAPI = {
  url: 'https://api.nytimes.com/svc/search/v2/articlesearch.json?',

  key: '&api-key=L5x1jxc7BGK5GdsesCTan33ncRlP52P6',

  getArticles(query) {
    return fetch(url + `q=${query}` + key)
    .then( response => {
      if (response.ok) {
        return response.json();
      } else {
        return 'error';
      }
    });
  }

}
