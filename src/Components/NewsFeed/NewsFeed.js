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
    if (!this.props.isError) {
      this.getArticles(this.props.query, this.props.currentPage, this.props.sort)
    }
  }

  componentWillReceiveProps(next) {
    let queryChange = next.query !== this.props.query;
    let pageChange = next.currentPage !== this.props.currentPage;
    let sortChange = next.sort !== this.props.sort;
    let valid = !this.props.isError;
    if ( valid && (queryChange || pageChange || sortChange) ) {
      this.getArticles(next.query, next.currentPage, next.sort);
    }
  }

  getArticles(query, page, sort) {
    this.props.setAppState( {loadingOverlayState: 'shown'} )
    timesAPI.getArticles(query, page - 1, sort)
    .then( data => {
      if (data === 'error') {
        return this.setState( {isError: true, isLoading: false, loadingOverlayState: 'hidden'} )
      }
      this.setState( {articles: data.response.docs} )
      this.props.setAppState( {
        isError: false,
        isLoading: false,
        loadingOverlayState: 'hidden',
        pageMax: Math.min( Math.ceil(data.response.meta.hits / 10), 100)
      } )
    })
    .catch( () => {
      this.props.setAppState( {isError: true, isLoading: false, loadingOverlayState: 'hidden'} )
    })
  }

  NewsCards = (props) => {
    let uniqueArticles = props.articles.reduce( (unique, article ) => {
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

    return <this.NewsCards articles={this.state.articles}/>
  }
}

export default NewsFeed;
