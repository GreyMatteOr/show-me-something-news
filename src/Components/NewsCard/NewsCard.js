import { Link } from 'react-router-dom';
import newspaper from '../../images/newspaper.png';
import './NewsCard.css';

function NewsCard({ article } ) {
  function makeImage() {
    let image = article.multimedia.find( media => media.type === 'image' && media.width > 300)
    if (image === undefined) {
      return (
        <img
          src={newspaper}
          alt={`"${article.headline.main}"`}
        />
      )
    }
    return (
      <img
        src={'https://www.nytimes.com/' + image.url}
        alt={`"${article.headline.main}"`}
      />
    )
  }


  let summary = (article.abstract.length > article.lead_paragraph.length
    ? article.abstract
    : article.lead_paragraph
  );
  if (summary.length === 0) summary = `${article.type_of_material}: ${article.headline.main}`;
  return (
    <Link to={article.web_url}
      className='news-card'
      data-testid='news-card'>
      {makeImage()}
      <section className='article-text'>
        <h2
          className='news-card-title'>
          {article.headline.main}
        </h2>
        <h4>{article.byline.original}</h4>
        <h4>
          Published: <time>{new Date(article.pub_date).toDateString()}</time>
          </h4>
        <p>{summary}</p>
      </section>
    </Link>
  )
}

export default NewsCard;
