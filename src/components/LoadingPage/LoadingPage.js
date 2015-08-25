
import React, { PropTypes } from 'react';
import styles from './LoadingPage.less';
import withStyles from '../../decorators/withStyles';
import withAuthentication from '../../decorators/withAuthentication';
import { Link } from 'react-router';

@withStyles(styles)

class LoadingPage extends React.Component {
  static contextTypes = {
    onSetTitle: PropTypes.func.isRequired,
    onPageNotFound: PropTypes.func.isRequired
  };
  render() {
    let title = this.props.user.name;
    this.context.onSetTitle(title);
    return (
      <div>
        
      </div>
    );
  }
}

export default LoadingPage;
