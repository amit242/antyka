import React, { PropTypes } from 'react';
import { Route, RouteHandler } from 'react-router';
import LoginStore from '../../stores/LoginStore';
import AppStore from '../../stores/AppStore';
import AuthService from '../../services/AuthService';
import styles from './App.less';
import withStyles from '../../decorators/withStyles';
import withContext from '../../decorators/withContext';
import Header from '../Header';
import Feedback from '../Feedback';
import Footer from '../Footer';
import LoginPage from '../LoginPage';
import { canUseDOM } from 'react/lib/ExecutionEnvironment';
import withAuthentication from '../../decorators/withAuthentication';

@withContext
@withStyles(styles)
export default class App extends React.Component {
  static contextTypes = {
    onSetTitle: PropTypes.func.isRequired
  };
  // static propTypes = {
  //   path: PropTypes.string.isRequired
  // };

  constructor() { 
    super()
    this.state = this._getLoginState();
  }

  _getLoginState() {
    return {
      userLoggedIn: LoginStore.isLoggedIn()
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
    console.log('App.Render()| client?:', canUseDOM);
    console.log('App.Render()| context:', this.context);
    console.log('App.Render()| isLoggedIn?:', this._getLoginState());

    this.context.onSetTitle('Closyaar');
    let mainSection;
    if(this._getLoginState() && this._getLoginState().userLoggedIn) {
      console.log('App.Render()| user logged in...');
      mainSection = <RouteHandler />;
    } else {
      console.log('App.Render()| user NOT logged in...');
      if(canUseDOM) {
        mainSection = <LoginPage />;
      } else {
        //mainSection = <RouteHandler />; // TODO: review code here
      }
    }
    /*
    if(!canUseDOM) {
      mainSection = <RouteHandler />;
    }*/

    return (
      <div className="App-container">
        <Header isLoggedIn={this._getLoginState()}/>
        {mainSection}
        <Feedback />
        <Footer />
      </div>);
  }
}

//export default App;
