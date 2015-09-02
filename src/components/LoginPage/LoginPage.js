/*! React Starter Kit | MIT License | http://www.reactstarterkit.com/ */

import React, { PropTypes, Component } from 'react';
import styles from './LoginPage.less';
import withStyles from '../../decorators/withStyles';
import Login from '../Login';
import LoadingPage from '../LoadingPage';
import RegisterPage from '../RegisterPage';
import RouterContainer from '../../services/RouterContainer';
import LoginStore from '../../stores/LoginStore';
import { canUseDOM } from 'react/lib/ExecutionEnvironment';
// import Link from '../../utils/Link';
// import AppActions from '../../actions/AppActions';
// import AuthService from '../../auth/AuthService';

@withStyles(styles)
export default class LoginPage extends Component {
  static contextTypes = {
    onSetTitle: PropTypes.func.isRequired
  };

  constructor() {
    super();
    this.state = {
      failed: false
    };
  }

  componentWillUnmount() {
    LoginStore.removeChangeListener(this.changeListener);
  }

  componentDidMount() {
    this.changeListener = this._onLoginStoreChange.bind(this);
    LoginStore.addChangeListener(this.changeListener);
  }
  _onLoginStoreChange() {
    console.log('LoginPage._onLoginStoreChange()| LoginStore changed!!! isLoginFailed?' , LoginStore.isLoginFailed());
    if(LoginStore.isLoginFailed()) {
      this.setState({failed: true});
    }
    if(LoginStore.isLoggedIn()) {
      console.log('LoginPage._onLoginStoreChange()| RouterContainer.get().getCurrentQuery():', RouterContainer.get().getCurrentQuery());
      var nextPath = RouterContainer.get().getCurrentQuery() && RouterContainer.get().getCurrentQuery().redirect || '/';
      console.log('LoginPage._onLoginStoreChange()| nextPath:', nextPath);
      RouterContainer.get().transitionTo(nextPath);
    }
    //this.setState(this._getLoginState());
  }

  componentWillUpdate() {
    console.log('LoginPage.componentWillUpdate()|', LoginStore.isLoggedIn());
    // if(LoginStore.isLoggedIn()) {
    //   console.log('LoginPage.componentWillUpdate()| RouterContainer.get().getCurrentQuery():', RouterContainer.get().getCurrentQuery());
    //   var nextPath = RouterContainer.get().getCurrentQuery() && RouterContainer.get().getCurrentQuery().redirect || '/';
    //   console.log('LoginPage.componentWillUpdate()| nextPath:', nextPath);
    //   RouterContainer.get().transitionTo(nextPath);
    // }
  }

  render() {
    
    console.log('LoginPage.render()| state', this.state);
    console.log('LoginPage.render()| props', this.props);
    console.log('LoginPage.render()| loading page?', this.props.rememberuser && !this.state.failed);

    let title = 'Login to Closyaar';
    this.context.onSetTitle(title);
    return this.props.rememberuser && !this.state.failed ? (<LoadingPage />) :
     (<div className="LoginPage">
        <Login className="Login"/>
        <RegisterPage className="Register" />
      </div>
    );
  }
}
