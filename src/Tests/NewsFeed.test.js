import NewsFeed from '../Components/NewsFeed/NewsFeed.js';
import { render, screen, waitFor } from '@testing-library/react';
import { render as render2 } from 'react-dom'
import { MemoryRouter } from "react-router-dom";
import '@testing-library/jest-dom';
import { timesAPI } from '../api-requests.js';


describe( 'NewsFeed', () => {

  describe( 'unit test', () => {

    let now, mockSetAppState, mockArticle;

    beforeEach( () => {
      mockSetAppState = jest.fn();
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
    });

    it( 'should render correctly without crashing', async () => {

      render(
        <MemoryRouter>
          <NewsFeed
            currentPage={1}
            isError={false}
            query={'debug'}
            setAppState={mockSetAppState}
          />
        </MemoryRouter>
      )

      await waitFor( () => expect(screen.getByTestId('news-card')).toBeInTheDocument() );

      expect(mockSetAppState).toBeCalledTimes(2);
      expect(mockSetAppState).toBeCalledWith( {loadingOverlayState: 'shown'} );

      expect(timesAPI.getArticles).toBeCalledTimes(1);
      expect(timesAPI.getArticles).toBeCalledWith('debug', 0);
    });

    it( 'should render an error message if the fetch fails', async () => {

      render(
        <MemoryRouter>
          <NewsFeed
            currentPage={1}
            isError={true}
            query={'debug'}
            setAppState={mockSetAppState}
          />
        </MemoryRouter>
      )

      expect(screen.getByText('Looks like something went wrong! Refresh the page to try again.')).toBeInTheDocument();
    });

    it( 'should remove any duplicate articles', async () => {

      timesAPI.getArticles = jest.fn().mockResolvedValue({
        response: {
          docs:[ mockArticle, mockArticle ],
          meta: {
            hits: 100
          }
        }
      })

      render(
        <MemoryRouter>
          <NewsFeed
            currentPage={1}
            isError={false}
            query={'debug'}
            setAppState={mockSetAppState}
          />
        </MemoryRouter>
      )

      await waitFor( () => expect(screen.getAllByTestId('news-card').length).toEqual(1) );
    })

    it( 'should reload when currentPage or the query props are updated ', async () => {

      let node = document.createElement('div');
      let component = render2(
        <NewsFeed
          currentPage={1}
          isError={false}
          query={'debug'}
          setAppState={mockSetAppState}
        />,
        node
      )

      await waitFor( () => expect(component.state.articles.length).toEqual(1) );
      expect(mockSetAppState).toBeCalledTimes(2);
      expect(timesAPI.getArticles).toBeCalledTimes(1);

      component = render2(
        <NewsFeed
          currentPage={2}
          isError={false}
          query={'debug'}
          setAppState={mockSetAppState}
        />,
      node
      )

      await waitFor( () => expect(component.state.currentPage).toEqual(2) );
      await waitFor( () => expect(mockSetAppState).toBeCalledTimes(4) );
      expect(timesAPI.getArticles).toBeCalledTimes(2);

      component = render2(
        <NewsFeed
          currentPage={2}
          isError={false}
          query={'foo'}
          setAppState={mockSetAppState}
        />,
      node
      )

      await waitFor( () => expect(mockSetAppState).toBeCalledTimes(6) );
      expect(timesAPI.getArticles).toBeCalledTimes(3);
    });
  });
});
