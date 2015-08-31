
import React, { PropTypes } from 'react';
import styles from './NeighbourhoodPage.less';
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

class NeighbourhoodPage extends React.Component {
  static contextTypes = {
    onSetTitle: PropTypes.func.isRequired,
    onPageNotFound: PropTypes.func.isRequired
  };
  render() {
    console.log('NeighbourhoodPage.render()|', this.props);
    let title = this.props.user.name;
    let hasNeighbourhood;
    if(this.props.user.neighbourhood) {
      hasNeighbourhood = true;
    }
    this.context.onSetTitle(title);
    return (
      <div className="neighbourhood">
        <UserMenu />
        {hasNeighbourhood ? 
          (
            <div className="neighbourhood-container">Details of your neighbourhood will come up here </div>
          ) : (<div className="neighbourhood-container">
          <span>Hi {this.props.user.name},</span>
          <p>You have not entered your neighbourhood details yet. Please go to the <Link to="map">map</Link> and select/create your neighbourhood</p>
          <br/>
          <p>Your current address:</p>
          <TextBox id="address" className="neighbourhood-textarea" ref="address" value={this.props.user.address} type="text" placeholder="address" maxLines={3}/>
        </div>)
        }
      </div>
    );
  }
}

export default NeighbourhoodPage;
