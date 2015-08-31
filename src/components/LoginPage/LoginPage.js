/*! React Starter Kit | MIT License | http://www.reactstarterkit.com/ */

import React, { PropTypes } from 'react';
import styles from './LoginPage.less';
import withStyles from '../../decorators/withStyles';
import Login from '../Login';
import RegisterPage from '../RegisterPage';
import RouterContainer from '../../services/RouterContainer';
import LoginStore from '../../stores/LoginStore';
// import Link from '../../utils/Link';
// import AppActions from '../../actions/AppActions';
// import AuthService from '../../auth/AuthService';

@withStyles(styles)
export default class LoginPage {
  static contextTypes = {
    onSetTitle: PropTypes.func.isRequired
  };

  componentWillUpdate() {
    console.log('LoginPage.componentWillUpdate()|', LoginStore.isLoggedIn());
    if(LoginStore.isLoggedIn()) {
      console.log('LoginPage.componentWillUpdate()| RouterContainer.get().getCurrentQuery():', RouterContainer.get().getCurrentQuery());
      var nextPath = RouterContainer.get().getCurrentQuery() && RouterContainer.get().getCurrentQuery().redirect || '/';
      console.log('LoginPage.componentWillUpdate()| nextPath:', nextPath);
      RouterContainer.get().transitionTo(nextPath);
    }
  }

  render() {
    
    console.log('LoginPage.render()|', LoginStore.isLoggedIn());

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
