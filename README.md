# Show Me Something News
## A Project by [Matthew Lane](https://github.com/GreyMatteOr) built from scratch in under 5 days

## Project Overview

Many people these days are concerned about how they are served the media they consume. On most of the popular social media sites, there are algorithms that curate the content a user will and won't see. On the surface, this doesn't seem terrible. However, it has recently come to light that there are some damaging repurcussions to this system, especially if users don't take it upon themselves to break out of their 'bubble'. To those that would experiment with a life outside their algorithm, Show Me Something News is a means of accessing high-quality articles from the New York Times but for randomly-generated topics.

By default, a single random word is generated. From there, articles about this topic are fetched and displayed. Single-word queries typically provide a smaller, but more focused and predictable result. To increase complexity, merely increase the number of search-terms in the preferences. The phrase will not be completely random, as the words will be moderately related. If on your internet stroll, any of the articles seem interesting, clicking on them will send you on your way down the rabbit-hole.

The words are generated using <a href='https://www.wordsapi.com'>WORDSAPI</a> and <a href='https://developers.nytimes.com'>NYTAPI</a>.

## How to use

Please visit the Show Me Something News [deployed site](https://greymatteor.github.io/show-me-something-news) in your browser. Once there, it will automatically load the page with content from the NYT. If you like to get different content, hit the `Show Me Something News` button in the top left. It is possible to add words to the search phrase by hitting the `adjust preferences` button and modifying the words to show.

It is possible to sort results by recency, relevancy, or chronologically by scrolling to the appropriate sort and hitting the button. Once you are satisfied with the search terms, clicking through the pages will show you all your results.

### Tech-used

- React
- JS
- CSS
- HTML
- WORDSAPI
- NYT-API
- Jest

### NOTES

Since this website is using free API's, it occasionally times out if there are too many requests to the API's. Since it is a proof-of-concept, it will not be upgraded. Please consider this when you use it, and if you encounter this problem, please wait apprimately 1 minute and try again.
