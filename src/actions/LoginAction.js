import Dispatcher from '../dispatchers/Dispatcher';
import ActionTypes from '../constants/ActionTypes';

export default {
  loginUser: (user, jwt) => {
    let jwtKey = 'closyaar-jwt-' + user;
    let savedJwt = localStorage.getItem(jwtKey);
    if(savedJwt !== jwt) {
      //var nextPath = RouterContainer.get().getCurrentQuery().nextPath || '/';

      //RouterContainer.get().transitionTo(nextPath);
      // We save the JWT in localStorage to keep the user authenticated. We’ll learn more about this later.
      console.debug('Saving jwt in localStorage for user', user);
      localStorage.setItem(jwtKey, jwt);
    }
    // Go to the Home page once the user is logged in
    //RouterContainer.get().transitionTo(‘/‘);

    // Send the action to all stores through the Dispatcher
    Dispatcher.dispatch({
      type: ActionTypes.LOGIN_USER,
      jwt: jwt
    });
  }
};
