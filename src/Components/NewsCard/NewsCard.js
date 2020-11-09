import { Link } from 'react-router-dom';
import newspaper from '../../images/newspaper.png';
import PropTypes from 'prop-types';
import './NewsCard.css';

function NewsCard({ article } ) {

  function makeImage() {
    let image = article.multimedia.find( media => media.type === 'image' && media.width >= 160);
    let src = 'https://www.nytimes.com/';
    if (image === undefined) src = newspaper;
    else src += image.url
    return (
      <img
        data-testid='nc-image'
        src={src}
        alt={`"${article.headline.main}"`}
      />
    )
  }

  function getBestSummary() {
    let summary = (article.abstract.length > article.lead_paragraph.length
      ? article.abstract
      : article.lead_paragraph
    );
    if (summary.length === 0) summary = `${article.type_of_material}: ${article.headline.main}`;
    return summary;
  }


  return (
    <Link to={article.web_url}
      className='news-card'
      data-testid='news-card'>
      {makeImage()}
      <section className='article-text'>
        <h2
          className='nc-title'>
          {article.headline.main}
        </h2>
        <h4>{article.byline.original}</h4>
        <h4>
          Published: <time>{new Date(article.pub_date).toDateString()}</time>
        </h4>
        <p data-testid='nc-summary'>{getBestSummary()}</p>
      </section>
    </Link>
  )
}

NewsCard.propTypes = {
  article: PropTypes.object
}

export default NewsCard;
