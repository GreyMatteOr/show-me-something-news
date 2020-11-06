import './App.css';
import React, { Component } from 'react';

class App extends Component {
  constructor(props) {
    super (props);
    this.state = {
      articles: [],
      numPhrases: 1,
      minimumWords: 1,
      maximumWords: 1,
      sortBy: 'Recent'
    }
  }

  createSelect = (propName, displayText, btnData, ...options) => {
    let btnHTML = <></>;
    if (btnHTML) {
      btnHTML = <button onClick={btnData.onClick}>{btnData.text}</button>
    }
    let optionsHTML = options.maps( (option, i) => <option key={i} value={option}>{option}</option>)
    return (
      <select
        name={propName}
        onChange={(e) => this.setState({[e.target.name]: e.target.value})}>
        {displayText}
        {optionsHTML}
        {btnHTML}
      </select>
    )
  }

  fetchArticles = () => {
    console.log('PlaceHolder. Find phrases:', this.state.numPhrases, `with ${this.state.minimumWords}-${this.state.maximumWords} words each`)
  }

  sortArticles = () => {
    console.log('PlaceHolder. Sort By:', this.state.sortBy);
  }

  Header = () => {
    let btnData = {text:'Sort By', onClick: this.sortArticles};
    return (
      <header
        data-testid='header'>
        <h1>
          Show Me Something News
        </h1>
        {this.createSelect('numPhrases', 'How many random phrases?', null, 1, 2, 3)}
        {this.createSelect('minimumWords', 'Minimum words', null, 1, 2, 3, 4, 5)}
        {this.createSelect('maximumWords', 'Maximum words', null, 1, 2, 3, 4, 5)}
        <button onClick={this.fetchArticles}>Go!</button>
        {this.createSelect('sortBy', '---', btnData, 'Recent', 'Relevance', 'Length')}
      </header>
    )
  }

  render() {
    return (
      <>
        <Header />
        <NewsFeed />
        <button>about</button>
        <Route
          path='/about'
          component={About}
        />
      </>
    );
  }
}

export default App;
