
import React, { PropTypes } from 'react';
import styles from './NeighborhoodPage.less';
import withStyles from '../../decorators/withStyles';
import withAuthentication from '../../decorators/withAuthentication';
import UserMenu from '../UserMenu';
import TextBox from '../TextBox';
import { Link } from 'react-router';
// import Link from '../../utils/Link';
// import AppActions from '../../actions/AppActions';
// import AuthService from '../../auth/AuthService';

@withAuthentication
@withStyles(styles)

class NeighborhoodPage extends React.Component {
  static contextTypes = {
    onSetTitle: PropTypes.func.isRequired,
    onPageNotFound: PropTypes.func.isRequired
  };
  render() {
    let title = this.props.user.name;
    let hasNeighborhood;
    if(this.props.user.neighborhood) {
      hasNeighborhood = true;
    }
    this.context.onSetTitle(title);
    return (
      <div className="neighborhood">
        <UserMenu />
        {hasNeighborhood ? 
          (
            <div className="neighborhood-container">Details of your neighborhood will come up here </div>
          ) : (<div className="neighborhood-container">
          <span>Hi {this.props.user.name},</span>
          <p>You have not entered your neighborhood details yet. Please go to the <Link to="map">map</Link> and select/create your neighborhood</p>
          <br/>
          <p>Your current address:</p>
          <TextBox id="address" className="neighborhood-textarea" ref="address" value={this.props.user.address} type="text" placeholder="address" maxLines={3}/>
        </div>)
        }
      </div>
    );
  }
}

export default NeighborhoodPage;
