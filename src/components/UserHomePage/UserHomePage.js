
import React, { PropTypes } from 'react';
import styles from './UserHomePage.less';
import withStyles from '../../decorators/withStyles';
import withAuthentication from '../../decorators/withAuthentication';
import { Link } from 'react-router';
import UserMenu from '../UserMenu';
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
    console.log('UserHomePage.render()! user:', this.props.user);
    let title = this.props.user.name;
    this.context.onSetTitle(title);
    return (
      <div className="userhome">
        <UserMenu />
        <div className="userhome-container">
        <Link to="neighbourhood">Go to your neighbourhood</Link>
        
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean consequat
  tortor fermentum mi fermentum dignissim. Nullam vel ipsum ut ligula elementum
  lobortis. Maecenas aliquam, massa laoreet lacinia pretium, nisi urna venenatis
  tortor, nec imperdiet tellus libero efficitur metus. Fusce semper posuere
  ligula, et facilisis metus bibendum interdum. Mauris at mauris sit amet sem
  pharetra commodo a eu leo. Nam at est non risus cursus maximus. Nam feugiat
  augue libero, id consectetur tortor bibendum non. Quisque nec fringilla lorem.
  Nullam efficitur vulputate mauris, nec maximus leo dignissim id.</p>
  <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean consequat
  tortor fermentum mi fermentum dignissim. Nullam vel ipsum ut ligula elementum
  lobortis. Maecenas aliquam, massa laoreet lacinia pretium, nisi urna venenatis
  tortor, nec imperdiet tellus libero efficitur metus. Fusce semper posuere
  ligula, et facilisis metus bibendum interdum. Mauris at mauris sit amet sem
  pharetra commodo a eu leo. Nam at est non risus cursus maximus. Nam feugiat
  augue libero, id consectetur tortor bibendum non. Quisque nec fringilla lorem.
  Nullam efficitur vulputate mauris, nec maximus leo dignissim id.</p>
  <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean consequat
  tortor fermentum mi fermentum dignissim. Nullam vel ipsum ut ligula elementum
  lobortis. Maecenas aliquam, massa laoreet lacinia pretium, nisi urna venenatis
  tortor, nec imperdiet tellus libero efficitur metus. Fusce semper posuere
  ligula, et facilisis metus bibendum interdum. Mauris at mauris sit amet sem
  pharetra commodo a eu leo. Nam at est non risus cursus maximus. Nam feugiat
  augue libero, id consectetur tortor bibendum non. Quisque nec fringilla lorem.
  Nullam efficitur vulputate mauris, nec maximus leo dignissim id.</p>
  <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean consequat
  tortor fermentum mi fermentum dignissim. Nullam vel ipsum ut ligula elementum
  lobortis. Maecenas aliquam, massa laoreet lacinia pretium, nisi urna venenatis
  tortor, nec imperdiet tellus libero efficitur metus. Fusce semper posuere
  ligula, et facilisis metus bibendum interdum. Mauris at mauris sit amet sem
  pharetra commodo a eu leo. Nam at est non risus cursus maximus. Nam feugiat
  augue libero, id consectetur tortor bibendum non. Quisque nec fringilla lorem.
  Nullam efficitur vulputate mauris, nec maximus leo dignissim id.</p>
  <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean consequat
  tortor fermentum mi fermentum dignissim. Nullam vel ipsum ut ligula elementum
  lobortis. Maecenas aliquam, massa laoreet lacinia pretium, nisi urna venenatis
  tortor, nec imperdiet tellus libero efficitur metus. Fusce semper posuere
  ligula, et facilisis metus bibendum interdum. Mauris at mauris sit amet sem
  pharetra commodo a eu leo. Nam at est non risus cursus maximus. Nam feugiat
  augue libero, id consectetur tortor bibendum non. Quisque nec fringilla lorem.
  Nullam efficitur vulputate mauris, nec maximus leo dignissim id.</p>
  <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean consequat
  tortor fermentum mi fermentum dignissim. Nullam vel ipsum ut ligula elementum
  lobortis. Maecenas aliquam, massa laoreet lacinia pretium, nisi urna venenatis
  tortor, nec imperdiet tellus libero efficitur metus. Fusce semper posuere
  ligula, et facilisis metus bibendum interdum. Mauris at mauris sit amet sem
  pharetra commodo a eu leo. Nam at est non risus cursus maximus. Nam feugiat
  augue libero, id consectetur tortor bibendum non. Quisque nec fringilla lorem.
  Nullam efficitur vulputate mauris, nec maximus leo dignissim id.</p>
  <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean consequat
  tortor fermentum mi fermentum dignissim. Nullam vel ipsum ut ligula elementum
  lobortis. Maecenas aliquam, massa laoreet lacinia pretium, nisi urna venenatis
  tortor, nec imperdiet tellus libero efficitur metus. Fusce semper posuere
  ligula, et facilisis metus bibendum interdum. Mauris at mauris sit amet sem
  pharetra commodo a eu leo. Nam at est non risus cursus maximus. Nam feugiat
  augue libero, id consectetur tortor bibendum non. Quisque nec fringilla lorem.
  Nullam efficitur vulputate mauris, nec maximus leo dignissim id.</p>
  <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean consequat
  tortor fermentum mi fermentum dignissim. Nullam vel ipsum ut ligula elementum
  lobortis. Maecenas aliquam, massa laoreet lacinia pretium, nisi urna venenatis
  tortor, nec imperdiet tellus libero efficitur metus. Fusce semper posuere
  ligula, et facilisis metus bibendum interdum. Mauris at mauris sit amet sem
  pharetra commodo a eu leo. Nam at est non risus cursus maximus. Nam feugiat
  augue libero, id consectetur tortor bibendum non. Quisque nec fringilla lorem.
  Nullam efficitur vulputate mauris, nec maximus leo dignissim id.</p>
  <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean consequat
  tortor fermentum mi fermentum dignissim. Nullam vel ipsum ut ligula elementum
  lobortis. Maecenas aliquam, massa laoreet lacinia pretium, nisi urna venenatis
  tortor, nec imperdiet tellus libero efficitur metus. Fusce semper posuere
  ligula, et facilisis metus bibendum interdum. Mauris at mauris sit amet sem
  pharetra commodo a eu leo. Nam at est non risus cursus maximus. Nam feugiat
  augue libero, id consectetur tortor bibendum non. Quisque nec fringilla lorem.
  Nullam efficitur vulputate mauris, nec maximus leo dignissim id.</p>
  <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean consequat
  tortor fermentum mi fermentum dignissim. Nullam vel ipsum ut ligula elementum
  lobortis. Maecenas aliquam, massa laoreet lacinia pretium, nisi urna venenatis
  tortor, nec imperdiet tellus libero efficitur metus. Fusce semper posuere
  ligula, et facilisis metus bibendum interdum. Mauris at mauris sit amet sem
  pharetra commodo a eu leo. Nam at est non risus cursus maximus. Nam feugiat
  augue libero, id consectetur tortor bibendum non. Quisque nec fringilla lorem.
  Nullam efficitur vulputate mauris, nec maximus leo dignissim id.</p>
  <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean consequat
  tortor fermentum mi fermentum dignissim. Nullam vel ipsum ut ligula elementum
  lobortis. Maecenas aliquam, massa laoreet lacinia pretium, nisi urna venenatis
  tortor, nec imperdiet tellus libero efficitur metus. Fusce semper posuere
  ligula, et facilisis metus bibendum interdum. Mauris at mauris sit amet sem
  pharetra commodo a eu leo. Nam at est non risus cursus maximus. Nam feugiat
  augue libero, id consectetur tortor bibendum non. Quisque nec fringilla lorem.
  Nullam efficitur vulputate mauris, nec maximus leo dignissim id.</p>
  <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean consequat
  tortor fermentum mi fermentum dignissim. Nullam vel ipsum ut ligula elementum
  lobortis. Maecenas aliquam, massa laoreet lacinia pretium, nisi urna venenatis
  tortor, nec imperdiet tellus libero efficitur metus. Fusce semper posuere
  ligula, et facilisis metus bibendum interdum. Mauris at mauris sit amet sem
  pharetra commodo a eu leo. Nam at est non risus cursus maximus. Nam feugiat
  augue libero, id consectetur tortor bibendum non. Quisque nec fringilla lorem.
  Nullam efficitur vulputate mauris, nec maximus leo dignissim id.</p>
        </div>
      </div>
    );
  }
}

export default UserHomePage;
