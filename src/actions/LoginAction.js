import Dispatcher from '../dispatchers/Dispatcher';
import ActionTypes from '../constants/ActionTypes';
import RouterContainer from '../services/RouterContainer';
import http from 'superagent';

let jwtKey = 'closyaar-jwt';
export default {
  loginUser: (jwt, user) => {
    console.log('LoginAction.loginUser()| supplied jwt:', jwt);

    if(jwt) {
      
      console.log('AuthService.verifyJWT()| Saving jwt in localStorage for user...');
      localStorage.setItem(jwtKey, jwt);
      // Send the action to all stores through the Dispatcher
      Dispatcher.dispatch({
        type: ActionTypes.LOGIN_USER,
        jwt: jwt,
        user: user
      });
    } else {
      console.log('LoginAction.loginUser()| Authentication Fail!!!');
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


  // TODO: refator and move REST call to authservice.js
  verifyUserToken: (jwt) => {
    console.log('LoginAction.verifyUserToken()| supplied jwt:', jwt);

    if(jwt) {
      http.get('/api/verifyusertoken')
      .set('x-closyaar-access-token', jwt)
      .end((err, response) => {
        console.log('LoginAction.verifyUserToken() rest call|  response', response.body);
        if(!err && response && response.body && response.body.success) {
          console.log('LoginAction.verifyUserToken()| Authentication success!!!', response.body.user);
          
          // Send the action to all stores through the Dispatcher

          Dispatcher.dispatch({
            type: ActionTypes.TOKEN_VERIFIED,
            user: response.body.user
          });
        } else {
          console.log('LoginAction.verifyUserToken()| Authentication Fail!!!');
          Dispatcher.dispatch({
            type: ActionTypes.TOKEN_VERIFIED,
            user: {
              invalidToken: true
            }
          });
          //console.log('LoginAction.verifyUserToken()| Err:', err);
        }
      });
    }
  }
};
