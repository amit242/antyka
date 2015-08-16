/*! React Starter Kit | MIT License | http://www.reactstarterkit.com/ */

import React, { PropTypes } from 'react';
import styles from './SetPassword.less';
import withStyles from '../../decorators/withStyles';
import TextBox from '../TextBox';
import LoginAction from '../../actions/LoginAction';
import LoginStore from '../../stores/LoginStore';
import classNames from 'classnames';

@withStyles(styles)
export default class LoginPage extends React.Component {
  static contextTypes = {
    onSetTitle: PropTypes.func.isRequired
  };

  constructor() {
    super();

    this.state = {
      newPwd: '',
      confirmPwd: ''
    };
  }

  _getUser() {
    return LoginStore.user;
  }


  _onchange(event) {
    //console.log('RegisterPage._onchange()| event:', event.target);
    let controlState = {};
    controlState[event.target.id] = event.target.value;
    //console.log('RegisterPage._onchange()| controlState:', controlState);
    this.setState(controlState);
  }
  /*_onChange() {
    console.log('SetPassword._onChange()| LoginStore changed!!!');
    this.setState(this._getLoginState());
  }*/

  componentWillMount() {
    //LoginStore.removeChangeListener(this.changeListener);
    console.log('SetPassword.componentWillMount()| query: ', this.props.query, this.props.user);
  }

  componentDidMount() {
    //this.changeListener = this._onChange.bind(this);
    //LoginStore.addChangeListener(this.changeListener);
    console.log('SetPassword.componentDidMount()| query: ', this.props.query);
    if(this.props.query && this.props.query.key) {
      LoginAction.verifyJWT(this.props.query.key);
    } else {
    }
  }

  updatePassword(e) {
    e.preventDefault();
    //alert(this.state);
    console.log('SetPassword.updatePassword()| state:', this.state, e);
    if(this.state.newPwd === this.state.confirmPwd) {
      let user = {
        id: this._getUser().id,
        password: this.state.newPwd
      }
      AuthService.signUp(user, () => {
        this.setState({signUpError: true});
      });
    } else {
      alert('Passwords dont match');
    }
    
  }

  render() {
    //console.log('amit', this);
    let title = 'Set/Reset Password';
    this.context.onSetTitle(title);
    console.log('SetPassword.render()| user: ', this._getUser());
    let pwdMatch;
    if(this.state.newPwd !== this.state.confirmPwd) {
      pwdMatch = 'SetPassword-textbox-error';
    }
    console.log('PWD AMIT:', this.state.newPwd, this.state.confirmPwd, pwdMatch);
    let user = this._getUser();
    let component;
    if(user && user.name) {
      component = <div className="SetPassword-container">
          <div>Hi {user.name}, <br /> Please update your Password</div>
          <TextBox id="newPwd" className='SetPassword-textbox' controlClassName={pwdMatch} ref="newPwd" value={this.newPwd} type="Password" placeholder="Enter New Password" onChange={this._onchange.bind(this)} />
          <TextBox id="confirmPwd" className="SetPassword-textbox" controlClassName={pwdMatch}  ref="confirmPwd" value={this.confirmPwd} type="Password" placeholder="Confirm Password" onChange={this._onchange.bind(this)} />
          <input type="submit"  value="Update Password" onClick={this.updatePassword.bind(this)} />
        </div>;
    } else if(user && user.invalidToken) {
      component = <div className="SetPassword-error">
          Bad Token!!!
        </div>
    } else {
      component = '';
    }
    return (
      <div className="SetPassword">
        {component}
      </div>
    );
  }
}
