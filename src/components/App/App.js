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
      userLoggedIn: LoginStore.isLoggedIn(),
      user: LoginStore.user
    };
  }

  componentWillUnmount() {
    LoginStore.removeChangeListener(this.changeListener);
    AppStore.removeChangeListener(this.changePageListener);
  }

  componentDidMount() {
    this.changeListener = this._onChange.bind(this);
    this.changePageListener = this._onPageChange.bind(this);
    LoginStore.addChangeListener(this.changeListener);
    AppStore.addChangeListener(this.changePageListener);
  }
  _onPageChange() {
    console.log('App._onPageChange()| AppStore changed!!!');
    //this.setState(this._getLoginState());
  }
  _onChange() {
    console.log('App._onChange()| LoginStore changed!!!');
    this.setState(this._getLoginState());
  }

  render() {
    console.log('App.Render()| client?:', canUseDOM);
    console.log('App.Render()| props:', this.props);
    console.log('App.Render()| state:', this.state);

    this.context.onSetTitle('Closyaar');

    if(this._getLoginState() && this._getLoginState().userLoggedIn) {
      console.log('App.Render()| user logged in...');

    } else {
      console.log('App.Render()| user NOT logged in...');
    }
    
    return (
      <div className="app-container">
        <Header LoginState={this.state}/>
        <RouteHandler {...this.props} user={this.state.user}/>
        <Feedback />
        <Footer LoginState={this.state}/>
      </div>);
  }
}

//export default App;
