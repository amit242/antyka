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
  let dt = new Date();
  //alert();
  console.log('Client.run()| render start... ', dt.getHours() + ':' + dt.getMinutes() + ':' + dt.getSeconds() + ':' +  dt.getMilliseconds());
  var router = Router.create({
    location: Router.HistoryLocation,
    routes: appRoutes
  });
  RouterContainer.set(router);

  let jwt = localStorage.getItem('closyaar-jwt');
  console.log('Client.run()| localStorage jwt:',jwt);
  let tryingLogin = false;
  if (jwt) {
    tryingLogin = true;
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
    console.log('Client.run()|  react render props:', props);
    React.render(<Handler { ...props } tryLogin = {tryingLogin}/>, document.getElementById('app'));
  });

  dt = new Date();
  console.log('Client.run()| render end... ', dt.getHours() + ':' + dt.getMinutes() + ':' + dt.getSeconds() + ':' +  dt.getMilliseconds());
}

try {
  Promise.all([
    new Promise((resolve) => {
      if (window.addEventListener) {
        window.addEventListener('DOMContentLoaded', resolve);
      } else {
        window.attachEvent('onload', resolve);
      }
    }).then(() => FastClick.attach(document.body))
  ]).then(run);
} catch(e) {
  // TODO: IE hack, find a better way to check if Promise is not defined
  console.log('Most probably you are running in IE, run without promise, error:', e);
  run(); // internet explorer
}

