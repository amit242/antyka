/*! React Starter Kit | MIT License | http://www.reactstarterkit.com/ */

import React, { PropTypes } from 'react';
import withStyles from '../../decorators/withStyles';
import styles from './RegisterPage.less';
import TextBox from '../TextBox';

@withStyles(styles)
class RegisterPage {

  static contextTypes = {
    onSetTitle: PropTypes.func.isRequired
  };

  render() {
    let title = 'New User Registration';
    this.context.onSetTitle(title);
    return (
      <div className="RegisterPage">
        <div className="RegisterPage-container">
          <h1>{title}</h1>
          <span>
            <div className="RegisterPage-container-traditional">
              <TextBox className="RegisterPage-textbox" ref="name" type="text" placeholder="Name" />
              <TextBox className="RegisterPage-textbox" ref="email" type="text" placeholder="email id" />
              <TextBox className="RegisterPage-textbox" ref="address" type="text" placeholder="address" maxLines={3} />
            </div>
            <span className="RegisterPage-spacer">Or</span>
            <div className="RegisterPage-container-social">
              <span>Login using: </span>
              <input className="RegisterPage-button" ref="facebookButton" type="button" value="Facebook" />
              <input className="RegisterPage-button" ref="gmailButton" type="button" value="Gmail" />
            </div>
          </span>
        </div>
      </div>
    );
  }

}

export default RegisterPage;
