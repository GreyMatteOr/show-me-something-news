import { createMemoryHistory } from 'history';
import App from '../Components/App/App.js';
import { render, screen, waitFor } from '@testing-library/react';
import { Router } from "react-router-dom";
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { wordAPI, timesAPI } from '../api-requests.js';


describe( 'App', () => {

  let history, now, mockSetAppState, mockArticle;

  beforeEach( () => {

    history = createMemoryHistory();

    now = new Date();
    mockArticle = {
      headline: {
        main: 'title'
      },
      byline: {
        original: 'Matthew Lane'
      },
      pub_date: now.toString(),
      web_url: '/debug',
      multimedia: [
        {width: 160, url: 'wrong1'},
        {type: 'image', width: 159, url: 'wrong2'},
        {type: 'image', width: 160, url: 'right'}
      ],
      abstract: 'foo',
      lead_paragraph: 'bar!',
      type_of_material: 'recipe'
    }

    timesAPI.getArticles = jest.fn().mockResolvedValue({
      response: {
        docs:[ mockArticle ],
        meta: {
          hits: 100
        }
      }
    });

    wordAPI.getPhrase = jest.fn().mockResolvedValue(['apple', 'banana', 'kiwi']);

  });

  it( 'should show a loading icon on load', () => {

    render(<Router history={history} ><App /></Router>);

    expect(screen.getByTestId('on-load-icon')).toBeInTheDocument();
  });

  it( 'should load a loading image for the newsfeed after fetchin a search phrase', async () => {

    history.push('/show-me-something-news')
    render(<Router history={history} ><App /></Router>);

    await waitFor( () => expect(wordAPI.getPhrase).toBeCalledTimes(1))

    let loading = screen.getByTestId('pre-feed-load');

    expect(screen.getByTestId('header')).toBeInTheDocument();
    expect(screen.getByText('...about: "apple banana kiwi"'))
    expect(loading.classList.toggle('shown')).toEqual(true)


  });

  it( 'should load a newsfeed after fetching the articles', async () => {
    history.push('/show-me-something-news')
    render(<Router history={history} ><App /></Router>);

    await waitFor( () => expect(wordAPI.getPhrase).toBeCalledTimes(1))
    await waitFor( () => expect(timesAPI.getArticles).toBeCalledTimes(1))

    expect(screen.getByTestId('newsfeed')).toBeInTheDocument();
  });

  it( 'should navigate to a new page after a user clicks on page button', async () => {
    history.push('/show-me-something-news')
    render(<Router history={history} ><App /></Router>);

    await waitFor( () => expect(wordAPI.getPhrase).toBeCalledTimes(1))
    await waitFor( () => expect(timesAPI.getArticles).toBeCalledTimes(1))

    let page10 = screen.getByText('10');
    userEvent.click(page10);
    await waitFor( () => expect(history.location.pathname).toEqual('/page/10'))

  })
})
