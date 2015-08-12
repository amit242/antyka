import React, { PropTypes } from 'react';
import { Route, RouteHandler } from 'react-router';
import LoginStore from '../../stores/LoginStore'
import AuthService from '../../services/AuthService';
import styles from './App.less';
import withStyles from '../../decorators/withStyles';
import withContext from '../../decorators/withContext';
import Header from '../Header';
import Feedback from '../Feedback';
import Footer from '../Footer';
import { canUseDOM } from 'react/lib/ExecutionEnvironment';


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
    console.log('===>App constructor:');    
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
    console.log('App Render client?:', canUseDOM, RouteHandler);
    console.log('App Render :', this.context);

    this.context.onSetTitle('Closyaar');

    return (
      <div>
        <Header isLoggedIn={this._getLoginState()}/>
        <RouteHandler />
        <Feedback />
        <Footer />
      </div>);
  }
}

//export default App;
