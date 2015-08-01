export default {
  loginUser: (jwt) => {
    // Go to the Home page once the user is logged in
    RouterContainer.get().transitionTo(‘/‘);
    // We save the JWT in localStorage to keep the user authenticated. We’ll learn more about this later.
    localStorage.setItem('jwt', jwt);
    // Send the action to all stores through the Dispatcher
    AppDispatcher.dispatch({
      actionType: LOGIN_USER,
      jwt: jwt
    });
  }
}