/*! React Starter Kit | MIT License | http://www.reactstarterkit.com/ */

import React, { PropTypes } from 'react';
import styles from './Login.less';
import withStyles from '../../decorators/withStyles';
import TextBox from '../TextBox';
import { Link } from 'react-router';
import classNames from 'classnames';
//import AppActions from '../../actions/AppActions';
import AuthService from '../../services/AuthService';

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
    //console.log('componentDidMount', this);
  }

  userNameChanged(event) {
    this.setState({userId: event.target.value});
  }

  passwordChanged(event) {
    this.setState({password: event.target.value});
  }

  authenticate(e) {
    e.preventDefault();
    //alert(this.state);
    console.log('Login.authenticate()| state:', this.state, e);
    AuthService.login(this.state.userId, this.state.password, () => {
      this.setState({loginError: true});
    });
    //alert(this.state);
    //   .catch(function(err) {
    //     console.log('Error logging in', err);
    //   });
  }

  render() {
    //console.log('amit', this);
    let title = 'Login';
    this.context.onSetTitle(title);
    return (
        <div className={classNames(this.props.className, 'Login-container')}>
          <form>
            <TextBox className="Login-TextBox" ref="userId" value={this.userId} type="text" placeholder="Email" onChange={this.userNameChanged.bind(this)} />
            <TextBox className="Login-TextBox" ref="password" value={this.password} type="password" placeholder="Password" onChange={this.passwordChanged.bind(this)} />
            {this.state.loginError && (<span className="Login-error">Invalid userId/password</span>)}
            <div className="Login-helper">
              <label><input type="checkbox" ref="rememberme" /><span>Remember me</span></label>
              <a className="Login-helper-forgot" href="/account/reset_password">Forgot password?</a>
            </div>
            <input type="submit" onClick={this.authenticate.bind(this)} value="Log in" />
          </form>
          <div className="Login-spacer">or</div>
          <Link className="Login-link Login-link-highlight" to="register">Login with Facebook</Link>
        </div>
    );
  }

}
