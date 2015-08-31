/*! React Starter Kit | MIT License | http://www.reactstarterkit.com/ */

import React, { PropTypes } from 'react';
import classNames from 'classnames';
import styles from './Navigation.less';
import withStyles from '../../decorators/withStyles';
import AuthService from '../../services/AuthService';
import { Link } from 'react-router';
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
    if(this.props.LoginState.userLoggedIn) {
      navContent = <a href="" className="navigation-link" onClick={this.logout}>Logout</a>;
    }
    return (
      <div className={classNames(this.props.className, 'navigation')} role="navigation">
        <div className="navigation-container">
          {this.props.LoginState && this.props.LoginState.userLoggedIn && <div>Welcome <Link className="navigation-link" to="/">{this.props.LoginState.user.name}</Link></div>}
          {navContent}
        </div>
      </div>
    );
  }

}

export default Navigation;
