import './App.css';
import history from '../../history.js';
import NewsFeed from '../NewsFeed/NewsFeed.js';
import React, { Component } from 'react';
import { Route, Router, Switch } from 'react-router-dom';
import { withRouter } from 'react-router-dom';

class App extends Component {
  constructor(props) {
    super (props);
    this.state = {
      currentPage: 1,
      numPhrases: 1,
      minimumWords: 1,
      maximumWords: 1,
      showPreferences: false,
      sortBy: 'Recent'
    }
  }

  About = () => {
    return <div onClick={() => history.push('/')}>ABOUT ME PLACEHOLDER</div>
  }

  changePage = (e) => {
    e.preventDefault();
    let newPage = e.target.value
    history.push(`/page/${newPage}`)
    this.setState({currentPage: newPage});
    history.go(0)
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

  fetchArticles = () => {
    console.log('PlaceHolder. Find phrases:', this.state.numPhrases, `with ${this.state.minimumWords}-${this.state.maximumWords} words each`)
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
          onClick={this.fetchArticles}>
          <h1>
            Show Me Something News
          </h1>
        </button>
        <div className={preferencesClass}>
          {this.createSelect('numPhrases', 'How many random phrases?', null, 1, 2, 3)}
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

  Home = (props) => {
    return (
      <NewsFeed
        key={1}
        changePage={this.changePage}
        currentPage={1}
        queryWords='Apple Banana Kiwi'
      />
    )
  }

  OffsetPage = (props) => {
    return (
      <NewsFeed
        key={props.match.params.pageName}
        changePage={this.changePage}
        currentPage={props.match.params.pageName}
        queryWords='Apple Banana Kiwi'
      />
    )
  }

  render() {
    let btnData = {text:'Sort By', onClick: this.sortArticles};
    return (
      <>
        <this.Header />
        <main>
          {this.createSelect('sortBy', null, btnData, 'Recent', 'Relevance', 'Oldest')}
          <Switch>
            <Route
              exact path='/'
              component={this.Home}
            />

            <Route
              exact path='/page/:pageName'
              component={this.OffsetPage}
            />

            <Route
              path='/about'
              component={this.About}
            />
          </Switch>
        </main>
        <button onClick={() => history.push('/about')}>about</button>

      </>
    );
  }
}

export default withRouter(App);
