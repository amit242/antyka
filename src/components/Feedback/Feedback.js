/*! React Starter Kit | MIT License | http://www.reactstarterkit.com/ */

import React from 'react';
import styles from './Feedback.less';
import withStyles from '../../decorators/withStyles';
import withViewport from '../../decorators/withViewport';

@withViewport
@withStyles(styles)
class Feedback {

  render() {
    let { width, height } = this.props.viewport;
    let feedbackClassName = "feedback";
    if(width < 340) {
      feedbackClassName += " bottom";
    }
    return (
      <div className={feedbackClassName}>
        <div className="feedback-container">
          <a className="feedback-link" href="https://github.com/amit242/antyka/issues/new">Ask a question</a>
          <span className="feedback-spacer">|</span>
          <a className="feedback-link" href="https://github.com/amit242/antyka/issues/new">Report an issue</a>
        </div>
      </div>
    );
  }

}

export default Feedback;
