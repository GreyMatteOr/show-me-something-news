import NewsCard from '../NewsCard/NewsCard.js';
import './NewsFeed.css';
import React, { Component } from 'react';
import {timesAPI} from '../../api-requests.js';


class NewsFeed extends Component {
  constructor(props) {
    super(props);
    this.state = {
      articles: [],
      currentPage: this.props.currentPage
    }
  }

  componentDidMount() {
    this.getArticles(this.props.query, this.props.currentPage)
  }

  componentWillReceiveProps(next) {
    if ( next.query !== this.props.query || next.currentPage !== this.props.currentPage ) {
      this.getArticles(next.query, next.currentPage);
    }
  }

  getArticles(query, page) {
    this.props.setAppState( {loadingOverlayState: 'shown'} )
    timesAPI.getArticles(query, page - 1)
    .then( data => {
      if (data === 'error') {
        return this.setState( {isError: true, loadingOverlayState: 'hidden'} )
      }
      this.setState( {articles: data.response.docs} )
      this.props.setAppState( {
        loadingOverlayState: 'hidden',
        loadingOverlayState: 'hidden',
        pageMax: Math.min( Math.ceil(data.response.meta.hits / 10), 100)
      } )
    })
    .catch( () => {
      this.props.setAppState( {isError: true, loadingOverlayState: 'hidden'} )
    })
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

  render() {
    if (this.props.isError) {
      return <h3>Looks like something went wrong! Refresh the page to try again.</h3>
    }

    return <this.NewsCards />
  }
}

export default NewsFeed;
