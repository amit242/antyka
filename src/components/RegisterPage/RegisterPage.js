/*! React Starter Kit | MIT License | http://www.reactstarterkit.com/ */

import React, { PropTypes } from 'react';
import withStyles from '../../decorators/withStyles';
import styles from './RegisterPage.less';
import TextBox from '../TextBox';
import classNames from 'classnames';
import AuthService from '../../services/AuthService';
import LoginStore from '../../stores/LoginStore';

@withStyles(styles)
class RegisterPage extends React.Component {

  static contextTypes = {
    onSetTitle: PropTypes.func.isRequired
  };

  constructor() {
    super();
    this.state = {
      name: '',
      email: '',
      address: '',
      signUpError: false
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

  signUp(e) {
    
    e.preventDefault();
    
    //alert(this.state);
    console.log('RegisterPage.signUp()| state:', this.state, e);
    if(this.state.name && this.state.email) {
      let user = {
        name: this.state.name,
        email: this.state.email,
        address: this.state.address
      }
      AuthService.signUp(user, (response) => {
        console.log('AMIT response:', response);
        this.setState({signUpError: response.body});
      });
    } else {
      this.setState({signUpError: {
        message: 'Name and Email are mandatory'
      }});
    }
  }

  render() {
    console.log('RegisterPage.render()| signUpError:', this.state.signUpError);
    let title = 'New User Registration!';
    this.context.onSetTitle(title);
    let user = this._getUser();
    let component;
    if(user) {
      //let userEmail = ;
      component = <div>
              Hello <b>{user.name}</b>, <br/>We have sent the verification email to <a href={'mailto:' + user.email}>{user.email}</a>. Please fllow the instruction provided in the email to complete your registration
            </div>
    } else {
      let errorComponent;
      if(this.state.signUpError && !this.state.signUpError.success) {
        errorComponent =  <div className="RegisterPage-error">
          <b>{this.state.signUpError.message}</b>
        </div>
      }

      component = <form>
          <b>{title}</b>
          {errorComponent}
          <TextBox id="name" className="RegisterPage-textbox" ref="name" value={this.name} type="text" placeholder="Name" onChange={this._onchange.bind(this)}/>
          <TextBox id="email" className="RegisterPage-textbox" ref="email" value={this.email} type="text" placeholder="email id" onChange={this._onchange.bind(this)}/>
          <TextBox id="address" className="RegisterPage-textbox" ref="address" value={this.address} type="text" placeholder="address" maxLines={3} onChange={this._onchange.bind(this)}/>
          <input type="submit"  value="Sign up" onClick={this.signUp.bind(this)} />
        </form>;
    }
    return (
      <div className={classNames(this.props.className, 'RegisterPage-container')} >
        {component}
      </div>
    );
  }

}

export default RegisterPage;
