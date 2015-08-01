/*! React Starter Kit | MIT License | http://www.reactstarterkit.com/ */

import React, { PropTypes } from 'react';
import styles from './Login.less';
import withStyles from '../../decorators/withStyles';
import TextBox from '../TextBox';
import Link from '../../utils/Link';
import AppActions from '../../actions/AppActions';
import AuthService from '../../auth/AuthService';

@withStyles(styles)
export default class Login extends React.Component {
  static contextTypes = {
    onSetTitle: PropTypes.func.isRequired
  };

  constructor() {
    super();

    this.state = {
      userId: '',
      password: '',
      loginError: false
    };
  }

  componentDidMount() {
    console.log('componentDidMount', this);
  }

  userNameChanged(event) {
    this.setState({userId: event.target.value});
  }

  passwordChanged(event) {
    this.setState({password: event.target.value});
  }

  authenticate() {
    console.log('DOM nodes', React.findDOMNode(this.refs.userId).value, React.findDOMNode(this.refs.password).value);
    console.log('this.state =', this.state);
  }

  render() {
    //console.log('amit', this);
    let title = 'Login';
    this.context.onSetTitle(title);
    return (
        <div className="Login-container">
          <TextBox className="Login-TextBox" ref="userId" value={this.userId} type="text" placeholder="Email" onChange={this.userNameChanged.bind(this)} />
          <TextBox className="Login-TextBox" ref="password" value={this.password} type="password" placeholder="Password" onChange={this.passwordChanged.bind(this)} />
          {this.state.loginError && (<p>Invalid userId/password</p>)}
          <div className="Login-helper">
            <label><input type="checkbox" ref="rememberme" /><span>Remember me</span></label>
            <a className="Login-helper-forgot" href="/account/reset_password">Forgot password?</a>
          </div>
          <input type="button" onClick={this.authenticate.bind(this)} value="Log in" />
          <div className="Login-spacer">or</div>
          <a className="Login-link Login-link--highlight" href="/register" onClick={Link.handleClick}>Sign up</a>
        </div>
    );
  }

}
