/*! React Starter Kit | MIT License | http://www.reactstarterkit.com/ */

import React, { PropTypes } from 'react';
import styles from './Footer.less';
import withViewport from '../../decorators/withViewport';
import withStyles from '../../decorators/withStyles';
import Link from '../../utils/Link';

@withViewport
@withStyles(styles)
class Footer {

  static propTypes = {
    viewport: PropTypes.shape({
      width: PropTypes.number.isRequired,
      height: PropTypes.number.isRequired
    }).isRequired
  };

  render() {
    // This is just an example how one can render CSS
    let { width, height } = this.props.viewport;
    this.renderCss(`.Footer-viewport:after {content:' ${width}x${height}';}`);
    var viewportString;

    if(this.props.isSmallViewport) {
      viewportString = '';
    } else {
      viewportString = 'Viewport:';
    }

    return (
      <div className="Footer">
        <div className="Footer-container">
          <span className="Footer-text">© closYaar</span>
          <span className="Footer-spacer"> | </span>
          <span ref="viewport" className="Footer-viewport Footer-text Footer-text--muted">{viewportString}</span>
          <span className="Footer-spacer">|</span>
          <a className="Footer-link" href="/" onClick={Link.handleClick}>Home</a>
          <span className="Footer-spacer">·</span>
          <a className="Footer-link" href="/privacy" onClick={Link.handleClick}>Privacy</a>
          <span className="Footer-spacer">·</span>
          <a className="Footer-link" href="/not-found" onClick={Link.handleClick}>Not Found</a>
          <span className="Footer-spacer"> | </span>
          <a className="Navigation-link" href="/login" onClick={Link.handleClick}>Log in</a>
          <span className="Footer-spacer">·</span>
          <a className="Footer-link" href="/about" onClick={Link.handleClick}>About</a>
          <span className="Footer-spacer">·</span>
          <a className="Footer-link" href="/contact" onClick={Link.handleClick}>Contact</a>
        </div>
      </div>
    );
  }

}

export default Footer;
