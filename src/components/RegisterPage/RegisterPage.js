/*! React Starter Kit | MIT License | http://www.reactstarterkit.com/ */

import React, { PropTypes } from 'react';
import withStyles from '../../decorators/withStyles';
import styles from './RegisterPage.less';
import TextBox from '../TextBox';
import classNames from 'classnames';
import AuthService from '../../services/AuthService';

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
    let user = {
      name: this.state.name,
      email: this.state.email,
      address: this.state.address
    }
    AuthService.signUp(user, () => {
      this.setState({signUpError: true});
    });
  }

  render() {
    let title = 'New User Registration!';
    this.context.onSetTitle(title);
    return (
      <div className={classNames(this.props.className, 'RegisterPage-container')} >
        <h1>{title}</h1>
        <form>
          <TextBox id="name" className="RegisterPage-textbox" ref="name" value={this.name} type="text" placeholder="Name" onChange={this._onchange.bind(this)}/>
          <TextBox id="email" className="RegisterPage-textbox" ref="email" value={this.email} type="text" placeholder="email id" onChange={this._onchange.bind(this)}/>
          <TextBox id="address" className="RegisterPage-textbox" ref="address" value={this.address} type="text" placeholder="address" maxLines={3} onChange={this._onchange.bind(this)}/>
          <input type="submit"  value="Sign up" onClick={this.signUp.bind(this)} />
        </form>
      </div>
    );
  }

}

export default RegisterPage;
