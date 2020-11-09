import './App.css';
import loading from '../../images/loading.png';
import NewsFeed from '../NewsFeed/NewsFeed.js';
import React, { Component } from 'react';
import { NavLink, Route, Router } from 'react-router-dom';
import {wordAPI} from '../../api-requests.js';

class App extends Component {
  constructor(props) {
    super (props);
    this.state = {
      numPhrases: 1,
      isError: false,
      loadingOverlayState: 'shown',
      minimumWords: 1,
      maximumWords: 1,
      pageMax: 1,
      query: '...',
      showPreferences: false,
      sortBy: 'Recent'
    }
  }

  componentDidMount() {
    this.getNewPhrase();
  }

  About = () => {
    return (
      <NavLink to='/'>
        <div>ABOUT ME PLACEHOLDER</div>
      </NavLink>
    )
  }

  createSelect = (propName, displayText, btnData, ...options) => {
    let btnHTML = <></>;
    if (btnData) {
      btnHTML = <button onClick={btnData.onClick}>{btnData.text}</button>
    }
    let optionsHTML = options.map( (option, i) => <option key={i} value={option}>{option}</option>)
    return (
      <div className='preferences'>
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
    wordAPI.getPhrase(this.state.minimumWords, this.state.maximumWords)
    .then( words => {
      if (words === 'error') {
        return this.setState( {isError: true} )
      }
      this.setState( {query: words.join(' '), currentPage: 1} )
    })
    .catch( () => this.setState( {isError: true} ))
  }

  sortArticles = () => {
    console.log('PlaceHolder. Sort By:', this.state.sortBy);
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
        <div className={preferencesClass}>
          {this.createSelect('minimumWords', 'Minimum words', null, 1, 2, 3, 4, 5)}
          {this.createSelect('maximumWords', 'Maximum words', null, 1, 2, 3, 4, 5)}
        </div>
        <button
          id='show-preferences'
          onClick={ () => this.setState({ showPreferences: !this.state.showPreferences })}
          >
          adjust preferences
        </button>
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
      />
    )
  }

  OffsetPage = (props) => {
    return (
      <NewsFeed
        currentPage={props.match.params.pageNum}
        isError={this.state.isError}
        query={this.state.query}
        setAppState={this.setAppState}
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
          <button onClick={ () => this.changePage(pageNum) }>
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
    if (this.query === '...') {
      return (
        <div className='shown'>
          <img
            className='spin'
            src={loading}
            alt='Loading Content'
          />
        </div>
      )
    }

    let btnData = {text:'Sort By', onClick: this.sortArticles};
    return (
      <>
        <this.Header />
        <main>
          {this.createSelect('sortBy', null, btnData, 'Recent', 'Relevance', 'Oldest')}
          <this.PageSelect pageMax={this.state.pageMax}/>
          <div className={this.state.loadingOverlayState}>
            <img
              className='spin'
              src={loading}
              alt='Loading Content'
            />
          </div>

          <Route
            exact path='/'
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
        <NavLink to='/about'>
          <button>about</button>
        </NavLink>

      </>
    );
  }
}

export default App;
