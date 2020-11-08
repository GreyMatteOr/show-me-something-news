import { createMemoryHistory } from 'history';
import NewsCard from '../Components/NewsCard/NewsCard.js';
import { render, screen, waitFor } from '@testing-library/react';
import { Router } from "react-router-dom";
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';

let customHistory = createMemoryHistory();

describe( 'NewsCard', () => {

  let now, mockArticle;
  beforeEach(() => {
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
  })

  describe( 'Render', () => {

    it('should render correctly without crashing', () => {

      render(
        <Router history={customHistory}>
          <NewsCard article={mockArticle} />
        </Router>
      );

      let image = screen.getByTestId('nc-image');
      let headline = screen.getByText('title');
      let byline = screen.getByText('Matthew Lane');
      let date = screen.getByText(now.toDateString());
      let summary = screen.getByText('bar!');

      expect(image).toBeInTheDocument();
      expect(image.src).toEqual('https://www.nytimes.com/right')
      expect(headline).toBeInTheDocument();
      expect(byline).toBeInTheDocument();
      expect(date).toBeInTheDocument();
      expect(summary).toBeInTheDocument();

    });

    it('should display a stock image when an appopriate one is not provided', () => {

      mockArticle.multimedia.pop();

      render(
        <Router history={customHistory}>
          <NewsCard article={mockArticle} />
        </Router>
      );

      let image = screen.getByTestId('nc-image');
      expect(image.src).toEqual('http://localhost/newspaper.png');
    });

    it('should show the media type when a better summary is no available', () => {

      mockArticle.abstract = '';
      mockArticle.lead_paragraph = '';

      render(
        <Router history={customHistory}>
          <NewsCard article={mockArticle} />
        </Router>
      );

      let summary = screen.getByText('recipe: title');
      expect(summary).toBeInTheDocument();
    });
  });
});

describe
