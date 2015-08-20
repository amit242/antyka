/*! React Starter Kit | MIT License | http://www.reactstarterkit.com/ */

import React, { PropTypes } from 'react';
import styles from './LoginPage.less';
import withStyles from '../../decorators/withStyles';
import Login from '../Login';
import RegisterPage from '../RegisterPage';
// import Link from '../../utils/Link';
// import AppActions from '../../actions/AppActions';
// import AuthService from '../../auth/AuthService';

@withStyles(styles)
export default class LoginPage {
  static contextTypes = {
    onSetTitle: PropTypes.func.isRequired
  };

  render() {
    //console.log('amit', this);
    let title = 'Login to Closyaar';
    this.context.onSetTitle(title);
    return (
      <div className="LoginPage">
        <Login className="Login"/>
        <RegisterPage className="Register" />
      </div>
    );
  }
}
