import NewsCard from '../NewsCard/NewsCard.js';
import React, { Component } from 'react';
import { timesAPI } from '../../api-requests.js';

class NewsFeed extends Component {
  constructor(props) {
    super(props);
    this.state = {
      articles: [],
      currentPage: null,
      isError: false,
      isLoading: true,
      pageMax: null
    }
  }

  componentDidMount() {
    timesAPI.getArticles('Apple Banana Kiwi')
    .then( data => {
      console.log(data)
      if (data === 'error') {
        return this.setState( {isError: true} )
      }
      let newState = {isLoading: false};
      newState.articles = data.response.docs;
      this.setState(newState);
    })
    .catch( () => this.setState( {isError: true} ))
  }

  render() {
    if (this.state.isError) {
      return <h3>Looks like something went wrong! Refresh the page to try again.</h3>
    }
    if (this.state.isLoading) {
      return <h3>Loading Articles...</h3>
    }

    let newscards = this.state.articles.reduce( (unique, article ) => {
      if (unique.every( inside => inside.web_url !== article.web_url)) unique.push(article);
      return unique;
    }, [])
    .map( (article, i) => {
      return <NewsCard key={i} article={article} />
    })
    return newscards
  }
}

export default NewsFeed;
