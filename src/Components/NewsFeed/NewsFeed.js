import loading from '../../images/loading.png';
import NewsCard from '../NewsCard/NewsCard.js';
import './NewsFeed.css';
import React, { Component } from 'react';
import { timesAPI } from '../../api-requests.js';

class NewsFeed extends Component {
  constructor(props) {
    super(props);
    this.state = {
      articles: [],
      isError: false,
      isLoading: true,
      loadingOverlayState: 'hidden',
      pageMax: 1
    }
  }

  componentDidMount() {
    this.changePage({target:{value:0}});
  }

  changePage = (e) => {
    this.setState( {loadingOverlayState: 'shown'} )
    timesAPI.getArticles('Apple Banana Kiwi', e.target.value)
    .then( data => {
      if (data === 'error') {
        return this.setState( {isError: true} )
      }
      let newState = {isLoading: false};
      newState.articles = data.response.docs;
      newState.pageMax = Math.min( (data.response.meta.hits / 10), 100);
      newState.loadingOverlayState = 'hidden';
      this.setState(newState);
    })
    .catch( () => this.setState( {isError: true} ))
  }

  NewsCards = () => {
    let uniqueArticles = this.state.articles.reduce( (unique, article ) => {
      let isNew = unique.every( inside => inside.web_url !== article.web_url );
      if (isNew) unique.push(article);
      return unique;
    }, []);

    return uniqueArticles.map( (article, i) => {
      return <NewsCard key={i} article={article} />
    });
  }

  PageSelect = () => {
    let optionsHTML = [];
    while (optionsHTML.length < this.state.pageMax) {
      let pos = optionsHTML.length;
      optionsHTML.push(<option key={pos} value={pos}>{pos + 1}</option>)
    }

    return (
      <div className='page-selection'>
        current page
        <select
          onChange={this.changePage}>
          {optionsHTML}
        </select>
      </div>
    )
  }

  render() {
    if (this.state.isError) {
      return <h3>Looks like something went wrong! Refresh the page to try again.</h3>
    }
    if (this.state.isLoading) {
      return <h3>Loading Articles...</h3>
    }

    return (
      <>
        <div className={this.state.loadingOverlayState}>
          <img
            className='spin'
            src={loading}
            alt='Loading Content'
          />
        </div>
        <this.PageSelect />
        <this.NewsCards />
      </>
    )
  }
}

export default NewsFeed;
