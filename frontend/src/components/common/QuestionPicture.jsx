import React from 'react';
import './QuestionPicture.css';

/**
 * The picture a question needs to be answered (a grid with labelled points),
 * shown between the question and its options. The HTML is inline SVG from
 * the Math seeds, bundled with the app like the explanation pictures.
 */
const QuestionPicture = ({ html }) => (html
  ? <div className="question-picture" dir="ltr" dangerouslySetInnerHTML={{ __html: html }} />
  : null);

export default QuestionPicture;
