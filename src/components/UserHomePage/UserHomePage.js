
import React, { PropTypes } from 'react';
import styles from './UserHomePage.less';
import withStyles from '../../decorators/withStyles';
import withAuthentication from '../../decorators/withAuthentication';
// import Link from '../../utils/Link';
// import AppActions from '../../actions/AppActions';
// import AuthService from '../../auth/AuthService';

@withStyles(styles)
@withAuthentication
export default class UserHomePage extends React.Component {
  static contextTypes = {
    onSetTitle: PropTypes.func.isRequired,
    onPageNotFound: PropTypes.func.isRequired
  };
  render() {
    let title = 'Home page for:';
    this.context.onSetTitle(title);
    return (
      <div className="UserHomePage">
        User logged in
      </div>
    );
  }
}
