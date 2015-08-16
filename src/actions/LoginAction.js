import Dispatcher from '../dispatchers/Dispatcher';
import ActionTypes from '../constants/ActionTypes';
import RouterContainer from '../services/RouterContainer';
import http from 'superagent';

let jwtKey = 'closyaar-jwt';
export default {
  loginUser: (jwt) => {
    console.log('LoginAction.loginUser()| supplied jwt:', jwt);

    if(jwt) {
      http.get('/api/verify')
      .set('x-closyaar-access-token', jwt)
      .end((err, response) => {
        console.log('LoginAction. rest call|  err, response', err, response);
        if(!err && response && response.body && response.body.verified) {
          console.log('LoginAction.loginUser()| Authentication success!!!');
          console.log('LoginAction.loginUser()| Saving jwt in localStorage for user...');
          
          localStorage.setItem(jwtKey, jwt);
          // Send the action to all stores through the Dispatcher

          Dispatcher.dispatch({
            type: ActionTypes.LOGIN_USER,
            jwt: jwt,
            user: {
              id: response.body.user,
              name: response.body.name
            }
          });
        } else {
          console.log('LoginAction.loginUser()| Authentication Fail!!!');
        }
        var nextPath = RouterContainer.get().getCurrentQuery() && RouterContainer.get().getCurrentQuery().nextPath || '/';
        RouterContainer.get().transitionTo(nextPath);
        console.log('LoginAction.loginUser()| nextPath:', nextPath);
      });
    }
  },

  logoutUser: () => {
    RouterContainer.get().transitionTo('/login');
    localStorage.removeItem(jwtKey);
    Dispatcher.dispatch({
      type: ActionTypes.LOGOUT_USER
    });
  },

  signUpUser: (user) => {
    //RouterContainer.get().transitionTo('/setpassword?emailsent=1');
    Dispatcher.dispatch({
      type: ActionTypes.SIGNUP_USER,
      user: user
    });
  },

  verifyJWT: (jwt) => {
    console.log('LoginAction.verifyJWT()| supplied jwt:', jwt);

    if(jwt) {
      http.get('/api/verifyusertoken')
      .set('x-closyaar-access-token', jwt)
      .end((err, response) => {
        console.log('LoginAction.verifyJWT() rest call|  response', response.body);
        if(!err && response && response.body && response.body.success) {
          console.log('LoginAction.verifyJWT()| Authentication success!!!', response.body.user);
          
          // Send the action to all stores through the Dispatcher

          Dispatcher.dispatch({
            type: ActionTypes.TOKEN_VERIFIED,
            user: response.body.user
          });
        } else {
          console.log('LoginAction.verifyJWT()| Authentication Fail!!!');
          Dispatcher.dispatch({
            type: ActionTypes.TOKEN_VERIFIED,
            user: {
              invalidToken: true
            }
          });
          //console.log('LoginAction.verifyJWT()| Err:', err);
        }
      });
    }
  }
};
