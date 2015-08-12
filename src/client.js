import React from 'react';
import Router, {Route} from 'react-router';
import App from './components/App';
import appRoutes from './routes/Routes';
import RouterContainer from './services/RouterContainer';
import LoginAction from './actions/LoginAction';
import ClientDetection from './utils/ClientDetection';
// import LoginPage from './components/LoginPage';
// import HomePage from './components/UserHomePage';
// import RegisterPage from './components/RegisterPage';
import AppActions from './actions/AppActions';
import ActionTypes from './constants/ActionTypes';
import FastClick from 'fastclick';

/*var appRoutes = (
  <Route handler={App}>
      <Route name="login" handler={LoginPage}/>
      <Route name="home" path="/" handler={HomePage}/>
      <Route name="register" handler={RegisterPage}/>
    </Route>
);*/

let path = decodeURI(window.location.pathname);
function run() {
  var router = Router.create({routes: appRoutes});
  RouterContainer.set(router);

  let jwt = localStorage.getItem('closyaar-jwt');
  console.log('appRoutessss:jwt:',jwt);
  if (jwt) {
    LoginAction.loginUser(jwt);
  }

  router.run(function (Handler) {
    let isMobile = ClientDetection.isMobile(navigator.userAgent);

    let props = {
      isMobile: {isMobile},
      context: {
        onSetTitle: value => {document.title = value; }
      }
    };
    console.log('Amit App.jsx:', Handler);
    React.render(<Handler { ...props } />, document.getElementById('app'));
  });
}

Promise.all([
  new Promise((resolve) => {
    if (window.addEventListener) {
      window.addEventListener('DOMContentLoaded', resolve);
    } else {
      window.attachEvent('onload', resolve);
    }
  }).then(() => FastClick.attach(document.body)),
  new Promise((resolve) => AppActions.loadPage(path, resolve))
]).then(run);

