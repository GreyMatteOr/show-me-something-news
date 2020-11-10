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

  it( 'should load a newsfeed after fetching the articles', async () => {
    history.push('/show-me-something-news')
    render(<Router history={history} ><App /></Router>);

    await waitFor( () => expect(wordAPI.getPhrase).toBeCalledTimes(1))
    await waitFor( () => expect(timesAPI.getArticles).toBeCalledTimes(1))

    expect(screen.getByTestId('newsfeed')).toBeInTheDocument();
  });

  it( 'should navigate to a new page after a user clicks on page-buttons', async () => {
    history.push('/show-me-something-news')
    render(<Router history={history} ><App /></Router>);

    await waitFor( () => expect(wordAPI.getPhrase).toBeCalledTimes(1))
    await waitFor( () => expect(timesAPI.getArticles).toBeCalledTimes(1))

    let page10 = screen.getByText('10');
    userEvent.click(page10);
    () => expect(history.location.pathname).toEqual('/page/10');
  })

  it( 'should fetch a new word after clicking on the Title button', async () => {

    history.push('/show-me-something-news')

    render(<Router history={history} ><App /></Router>);
    await waitFor( () => expect(wordAPI.getPhrase).toBeCalledTimes(1))

    let title = screen.getByText('Show Me Something News');
    userEvent.click(title);

    await waitFor( () => expect(wordAPI.getPhrase).toBeCalledTimes(2))
  });

  it( 'should show the about overlay when `about` is clicked', async () => {

    render(<Router history={history} ><App /></Router>);
    await waitFor( () => expect(wordAPI.getPhrase).toBeCalledTimes(1))

    let aboutBtn = screen.getByText('about');
    userEvent.click(aboutBtn);

    let aboutOverlay = screen.getByTestId('about-overlay');
    expect(aboutOverlay.classList.contains('about-show')).toEqual(true);

    userEvent.click(aboutOverlay);
    expect(aboutOverlay.classList.contains('about-show')).toEqual(false);
  });

  it( 'should toggle the preferences div when the `adjust preferences` btn is clicked', async () => {

    render(<Router history={history} ><App /></Router>);
    await waitFor( () => expect(wordAPI.getPhrase).toBeCalledTimes(1))

    let prefDiv = screen.getByTestId('preferences-select')
    let prefBTN = screen.getByText('adjust preferences');

    expect(prefDiv.classList.contains('hidden')).toEqual(true);
    userEvent.click(prefBTN);
    expect(prefDiv.classList.contains('hidden')).toEqual(false)
    userEvent.click(prefBTN);
    expect(prefDiv.classList.contains('hidden')).toEqual(true);

  })

  it( 'should call `getPhrase` with whatever number was selected', async () =>  {

    render(<Router history={history} ><App /></Router>);
    await waitFor( () => expect(wordAPI.getPhrase).toBeCalledTimes(1))

    let prefBTN = screen.getByText('adjust preferences');
    userEvent.click(prefBTN);

    let select = screen.getByTestId(`select-numWords`)
    userEvent.type(select, '1{enter}');

    let title = screen.getByText('Show Me Something News')
    userEvent.click(title)

    await waitFor(() => expect(wordAPI.getPhrase).toBeCalledTimes(2))
    expect(wordAPI.getPhrase).toBeCalledWith(1)
  })
})
