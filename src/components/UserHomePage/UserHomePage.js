
import React, { PropTypes } from 'react';
import styles from './UserHomePage.less';
import withStyles from '../../decorators/withStyles';
import withAuthentication from '../../decorators/withAuthentication';
import Map from '../Map';
// import Link from '../../utils/Link';
// import AppActions from '../../actions/AppActions';
// import AuthService from '../../auth/AuthService';

@withAuthentication
@withStyles(styles)

class UserHomePage extends React.Component {
  static contextTypes = {
    onSetTitle: PropTypes.func.isRequired,
    onPageNotFound: PropTypes.func.isRequired
  };
  render() {
    let title = this.props.user.name;
    this.context.onSetTitle(title);
    return (
      <div className="UserHomePage">
        <span>User name: {this.props.user.name}</span>
        <br/>
        <span>id: {this.props.user.id}</span>
        <Map />
      </div>
    );
  }
}

export default UserHomePage;
