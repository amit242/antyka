
import React, { PropTypes } from 'react';
import styles from './UserMenu.less';
import withStyles from '../../decorators/withStyles';
import withAuthentication from '../../decorators/withAuthentication';
import { Link } from 'react-router';
// import Link from '../../utils/Link';
// import AppActions from '../../actions/AppActions';
// import AuthService from '../../auth/AuthService';

@withAuthentication
@withStyles(styles)

class UserMenu extends React.Component {
  static contextTypes = {
    onSetTitle: PropTypes.func.isRequired,
    onPageNotFound: PropTypes.func.isRequired
  };
  render() {
    let title = this.props.user.name;
    this.context.onSetTitle(title);
    return (
      <div className="usermenu">
        <ul>
          <li><Link className="usermenu-link" to="/">{title}</Link></li>
          <li><Link className="usermenu-link" to="/">Messages</Link></li>
          <li><Link className="usermenu-link" to="/">Closyaars</Link></li>
          <li><Link className="usermenu-link" to="map">Map</Link></li>
          <li><Link className="usermenu-link" to="neighborhood">Neighborhood</Link></li>
        </ul>
      </div>
    );
  }
}

export default UserMenu;
