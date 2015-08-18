/*! React Starter Kit | MIT License | http://www.reactstarterkit.com/ */

import React, { PropTypes } from 'react';
import styles from './SetPassword.less';
import withStyles from '../../decorators/withStyles';
import TextBox from '../TextBox';
import LoginAction from '../../actions/LoginAction';
import LoginStore from '../../stores/LoginStore';
import AuthService from '../../services/AuthService';
import classNames from 'classnames';
import { Link } from 'react-router';

@withStyles(styles)
export default class LoginPage extends React.Component {
  static contextTypes = {
    onSetTitle: PropTypes.func.isRequired
  };

  constructor() {
    super();

    this.state = {
      newPwd: '',
      confirmPwd: '',
      updateResponse: null
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
    let pattern = new RegExp(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{8,}$/);


    if(this.state.newPwd === this.state.confirmPwd) {
      if(pattern.test(this.state.newPwd)) {
        let user = this._getUser();
        user.password = this.state.newPwd;

        AuthService.changePassword(user, (response) => {
          this.setState({updateResponse: response});
        },
          (response) => {
          this.setState({updateResponse: response});
        });
      } else {
        alert('Passwords must have: \nMinimum 8 characters\nAt least 1 Alphabet, 1 Number and 1 Special Character\nNo spaces');
      }
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
    let component;
    console.log('PWD server response:', this.state.updateResponse);
    
    if(this.state.updateResponse) {
      let classname, message = this.state.updateResponse.message;
      if(this.state.updateResponse.success) {
        classname = 'SetPassword-success';
        message = <div>{message}Please <Link  to="login">login</Link> with the new password...</div>;
      } else {
        classname = 'SetPassword-error';
      }
      component = <div className={classname}>
          {message}
        </div>
    } else {
      let user = this._getUser();
      if(user && user.name) {
        component = <div className="SetPassword-container">
            <div>Hello <b>{user.name}</b>, <br /> Please update your Password</div>
            <TextBox id="newPwd" className='SetPassword-textbox' controlClassName={pwdMatch} ref="newPwd" value={this.newPwd} type="Password" placeholder="Enter New Password" onChange={this._onchange.bind(this)} />
            <TextBox id="confirmPwd" className="SetPassword-textbox" controlClassName={pwdMatch}  ref="confirmPwd" value={this.confirmPwd} type="Password" placeholder="Confirm Password" onChange={this._onchange.bind(this)} />
            <input type="submit"  value="Update Password" onClick={this.updatePassword.bind(this)} />
          </div>;
      } else if(user && user.invalidToken) {
        component = <div className="SetPassword-error">
            Bad/Expired Token!!!
          </div>
      } else {
        component = '';
      }
    }
    return (
      <div className="SetPassword">
        {component}
      </div>
    );
  }
}
