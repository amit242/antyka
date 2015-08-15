  /*! React Starter Kit | MIT License | http://www.reactstarterkit.com/ */

import React from 'react';
import styles from './Header.less';
import withStyles from '../../decorators/withStyles';
import Link from '../../utils/Link';
import Navigation from '../Navigation';

@withStyles(styles)
class Header {

  render() {
    console.log('Header.render()| props:', this.props);
    return (
      <div className="Header">
        <div className="Header-container">
          <a className="Header-brand" href="/" onClick={Link.handleClick}>
            <img className="Header-brandImg" src={require('./Closyaar-logo-medium.png')} width="114" height="62" alt="closyaar" />
          </a>
          <Navigation className="Header-nav" {...this.props.isLoggedIn}/>
          <div className="Header-banner">

          </div>
        </div>
      </div>
    );
  }

}

export default Header;
