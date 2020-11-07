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

  async getPhrase(min, max, numWords, data = []) {
    if (numWords === undefined) {
      let range = (max + .99) - min
      let rand =  Math.floor( Math.random() * range );
      numWords = min + rand;
    }
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
