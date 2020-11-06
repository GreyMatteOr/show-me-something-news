export const wordAPI = {
  url: 'https://wordsapiv1.p.rapidapi.com/words/',

  getRandom() {
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
  }
}

export const timesAPI ={

}
