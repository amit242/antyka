/*! React Starter Kit | MIT License | http://www.reactstarterkit.com/ */

import React, { PropTypes } from 'react';
import classNames from 'classnames';
import styles from './Navigation.less';
import withStyles from '../../decorators/withStyles';
import AuthService from '../../services/AuthService';
//import Link from '../../utils/Link';

@withStyles(styles)
class Navigation {

  static propTypes = {
    className: PropTypes.string
  };

  logout(e) {
    e.preventDefault();
    AuthService.logout();
  }

  render() {
  	console.log('Navigation.render()| props:', this.props);
  	let navContent;
    if(this.props.userLoggedIn) {
      navContent = <a href="" className="Navigation-link" onClick={this.logout}>Logout</a>;
    }
    return (
      <div className={classNames(this.props.className, 'Navigation')} role="navigation">
        {this.props.userLoggedIn && <div>Welcome {this.props.user.name}</div>}
        {navContent}
      </div>
    );
  }

}

export default Navigation;
