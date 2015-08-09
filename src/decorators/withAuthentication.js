import React from 'react';
import LoginStore from '../stores/LoginStore';
import AppActions from '../actions/AppActions';

export default (ComposedComponent) => {
  return class withAuthentication extends React.Component {

    // This method is called before transitioning to this component. If the user is not logged in, we’ll send him or her
    // to the Login page.
    static willTransitionTo() {
      console.log('AMIMT withAuthentication:',LoginStore.isLoggedIn());
      if (!LoginStore.isLoggedIn()) {
        console.log('AMIMT withAuthentication: user not logged in');
        AppActions.navigateTo('/login');
        //AppActions.redirect('/login', {}, {'nextPath': transition.path});
      }
    }

    constructor() {
      super();
      this.state = this._getLoginState();
    }

    _getLoginState() {
      return {
        userLoggedIn: LoginStore.isLoggedIn(),
        user: LoginStore.user,
        jwt: LoginStore.jwt
      };
    }

    componentDidMount() {
      this.changeListener = this._onChange.bind(this);
      LoginStore.addChangeListener(this.changeListener);
    }

    _onChange() {
      this.setState(this._getLoginState());
    }

    componentWillUnmount() {
      LoginStore.removeChangeListener(this.changeListener);
    }

    render() {
     // if(this.state.userLoggedIn) {
        return (
        <ComposedComponent
          {...this.props}
          user={this.state.user}
          jwt={this.state.jwt}
          userLoggedIn={this.state.userLoggedIn} />
        );
      //} else {
      //  withAuthentication.willTransitionTo();
      //}
    }
  };
};
