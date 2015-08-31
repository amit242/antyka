/*! React Starter Kit | MIT License | http://www.reactstarterkit.com/ */

import React, { PropTypes } from 'react';
import styles from './Footer.less';
import withViewport from '../../decorators/withViewport';
import withStyles from '../../decorators/withStyles';
import { Link } from 'react-router';

@withViewport
@withStyles(styles)
class Footer {

  static propTypes = {
    viewport: PropTypes.shape({
      width: PropTypes.number.isRequired,
      height: PropTypes.number.isRequired
    }).isRequired
  };
  /*componentWillMount() {
    let { width, height } = this.props.viewport;
    console.log('Footer componentWillMount()|', arguments, width, height);
  }
  componentDidMount(rootNode) {
    let { width, height } = this.props.viewport;
    console.log('Footer componentDidMount()|', arguments, width, height);
  }*/
  render() {
    // This is just an example how one can render CSS
    let { width, height } = this.props.viewport;
    //console.log('Footer render()|', width, height);
    // let width=400;
    // let height=700;
    this.renderCss(`.Footer-viewport:after {content:' ${width}x${height}';}`);
    var viewportString;


// console.log'FOOTER render', this.isSmallViewport);
    let footerClassName = "Footer";
    if(width < 340) {
      footerClassName += " hide";
    }
    /*if(width < 630) {
      viewportString = '';
    } else {
      viewportString = 'Viewport:';
    }*/
    return (
      <div className={footerClassName}>
        <div className="Footer-container">
          <span className="Footer-text">© closYaar</span>
          <span className="Footer-spacer"> | </span>
          <span ref="viewport" className="Footer-viewport Footer-text Footer-text--muted">{viewportString}</span>
          <span className="Footer-spacer">|</span>
          <Link className="Footer-link" to="/">Home</Link>
          
          {!this.props.LoginState.userLoggedIn && (<span className="Footer-spacer">·</span>)}
          {!this.props.LoginState.userLoggedIn && (<Link className="Footer-link" to="login">Log in</Link>)}
          {width > 350 && (<span className="Footer-spacer"> | </span>)}
          {width > 350 && (<Link className="Footer-link" to="about">About</Link>)}
          {width > 420 && (<span className="Footer-spacer">·</span>)}
          {width > 420 && (<Link className="Footer-link" to="contact">Contact</Link>)}
          {width > 480 && (<span className="Footer-spacer">·</span>)}
          {width > 480 && (<Link className="Footer-link" to="privacy">Privacy</Link>)}
        </div>
      </div>
    );
    /*return (
      <div className={footerClassName}>
        <div className="Footer-container">
          <span className="Footer-text">© closYaar</span>
          <span className="Footer-spacer"> | </span>
          <span ref="viewport" className="Footer-viewport Footer-text Footer-text--muted">{viewportString}</span>
          <span className="Footer-spacer">|</span>
          <a className="Footer-link" href="/" onClick={Link.handleClick}>Home</a>
          
          {!this.props.LoginState.userLoggedIn && (<span className="Footer-spacer">·</span>)}
          {!this.props.LoginState.userLoggedIn && (<Link className="Footer-link" to="login">Log in</Link>)}
          <span className="Footer-spacer">·</span>
          <a className="Footer-link" href="/not-found" onClick={Link.handleClick}>Not Found</a>
          <span className="Footer-spacer"> | </span>
          <a className="Footer-link" href="/about" onClick={Link.handleClick}>About</a>
          <span className="Footer-spacer">·</span>
          <a className="Footer-link" href="/contact" onClick={Link.handleClick}>Contact</a>
          <span className="Footer-spacer">·</span>
          <a className="Footer-link" href="/privacy" onClick={Link.handleClick}>Privacy</a>
        </div>
      </div>
    );*/
  }

}

export default Footer;
