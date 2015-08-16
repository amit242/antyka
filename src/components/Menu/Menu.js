
import React, { PropTypes } from 'react';
import classNames from 'classnames';
import styles from './Navigation.less';
import withStyles from '../../decorators/withStyles';

@withStyles(styles)
class Menu {
  static propTypes = {
    className: PropTypes.string
  };
  render() {
    console.log('Menu.render()| props:', this.props);
    let navContent;
    if(this.props.userLoggedIn) {
      navContent = <a href="" className="Navigation-link" onClick={this.logout}>Logout</a>;
    }
    return (
      <div>
        
      </div>
    );
  }
}

export default Menu;
