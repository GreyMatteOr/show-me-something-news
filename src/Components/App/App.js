import './App.css';
import loading from '../../images/loading.png';
import NewsFeed from '../NewsFeed/NewsFeed.js';
import React, { Component } from 'react';
import { NavLink, Route} from 'react-router-dom';
import {wordAPI} from '../../api-requests.js';

class App extends Component {
  constructor(props) {
    super (props);
    this.state = {
      numPhrases: 1,
      isError: false,
      isLoading: true,
      loadingOverlayState: 'shown',
      mightSortBy: 'relevance',
      numWords: 1,
      pageMax: 1,
      query: null,
      showAbout: false,
      showPreferences: false,
      sortBy: 'relevance'
    }
  }

  componentDidMount() {
    this.getNewPhrase();
  }

  About = (props) => {
    return (
      <div
        className={props.disp}
        onClick={ () => this.setState( {showAbout: !this.state.showAbout} ) }>
        <div className='about-holder'>
          <h4 className='about-text'>About Show Me Something News</h4>
          <p className='about-text'>
            Many people these days are concerned about how they are served the media they are consuming. There are algorithms in charge of curating content on most of the popular social media sites. On the surface, this doesn't seem terrible. However, it has recently come to light that there are some terrible repurcussions to the current way mass-media is provided. To those that would experiment with a life outside of intentional media seeking you out, Show Me Something News is a means of accessing high-quality articles from the New York Times but for randomly-generated topics.
          </p>
          <p className='about-text'>
            By default, a single random word is generated at random. From there, articles about this topic are fetched and displayed. Single-word queries typically provide a smaller, but more focused and predictable result. To increase complexity, merely increase the number of search-terms in the preferences. The phrase will not be completely random, as the words will be moderately related.
          </p>
          <p className='about-text'>
            The words are generated using <a href='https://www.wordsapi.com'>WORDSAPI</a> and <a href='https://developers.nytimes.com'>NYTAPI</a>. If you're curious about the developer, please check out <a href='https://github.com/greymatteor'>my GitHub profile</a>.
          </p>
        </div>
      </div>
    )
  }

  createSelect = (propName, displayText, btnData, ...options) => {
    let btnHTML = <></>;
    if (btnData) {
      btnHTML = <button id='select-btn' onClick={btnData.onClick}>{btnData.text}</button>
    }
    let optionsHTML = options.map( (option, i) => <option key={i} value={option}>{option}</option>)
    return (
      <div className='preferences-select'>
        {displayText}
        {btnHTML}
        <select
          name={propName}
          onChange={(e) => this.setState({[e.target.name]: e.target.value})}>
          {optionsHTML}
        </select>
      </div>
    )
  }

  getNewPhrase = () => {
    wordAPI.getPhrase(this.state.numWords)
    .then( words => {
      if (words === 'error') {
        return this.setState( {isError: true, isLoading: false} )
      }
      this.setState( {query: words.join(' '), currentPage: 1, isLoading: false} )
    })
    .catch( () => this.setState( {isError: true, isLoading: false} ))
  }

  setSort = () => {
    this.setState({sort: this.state.mightSortBy});
  }

  Header = () => {
    let preferencesClass = this.state.showPreferences ? 'search-preferences' : 'search-preferences hidden'
    return (
      <header
        data-testid='header'>
        <button
          id='title-btn'
          onClick={this.getNewPhrase}>
          <h1>
            Show Me Something News
          </h1>
        </button>
        <h2>{`...about: "${this.state.query}`}"</h2>
        <section className='header-right'>
          <div className={preferencesClass}>
            {this.createSelect('numWords', 'words per phrase', null, 1, 2, 3, 4, 5)}
          </div>
          <div id='header-right-btns'>
            <button
              className='hr-btn'
              onClick={ () => this.setState({ showPreferences: !this.state.showPreferences })}
              >
              adjust preferences
            </button>
            <button className='hr-btn' onClick={ () => this.setState( {showAbout: !this.state.showAbout} ) }>about</button>
          </div>
        </section>
      </header>
    )
  }

  Home = () => {
    return (
      <NewsFeed
        currentPage={1}
        isError={this.state.isError}
        query={this.state.query}
        setAppState={this.setAppState}
        sort={this.state.sort}
      />
    );
  }

  OffsetPage = (props) => {
    return (
      <NewsFeed
        currentPage={+props.match.params.pageNum}
        isError={this.state.isError}
        query={this.state.query}
        setAppState={this.setAppState}
        sort={this.state.sort}
      />
    )
  }

  PageSelect = (props) => {
    let optionsHTML = [];
    while (optionsHTML.length < props.pageMax) {
      let pageNum = optionsHTML.length + 1;
      optionsHTML.push(
        <NavLink
          to={`/page/${pageNum}`}
          key={pageNum}>
          <button>
            {pageNum}
          </button>
        </NavLink>
      )
    }

    return (
      <div className='page-selection'>
          {optionsHTML}
      </div>
    )
  }

  setAppState = (state) => {
    this.setState(state);
  }

  render() {
    if (this.state.isLoading) {
      return (
        <div className='on-load-spin'>
          <img
            className='spin'
            src={loading}
            alt='Loading Content'
          />
        </div>
      )
    }

    let btnData = {text:'Sort By', onClick: this.setSort};
    let showAbout = this.state.showAbout ? 'about-show' : '';
    return (
      <>
        <this.Header />
        <this.About disp={`about-overlay ${showAbout}`} />
        <main>
          {this.createSelect('mightSortBy', null, btnData, 'relevance', 'newest', 'oldest')}
          <this.PageSelect pageMax={this.state.pageMax}/>
          <div className={this.state.loadingOverlayState}>
            <img
              className='spin'
              src={loading}
              alt='Loading Content'
            />
          </div>

          <Route
            exact path='/show-me-something-news'
            component={this.Home}
          />

          <Route
            exact path='/page/:pageNum'
            component={this.OffsetPage}
          />

          <Route
            path='/about'
            component={this.About}
          />
        </main>
      </>
    );
  }
}

export default App;
