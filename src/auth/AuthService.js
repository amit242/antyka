

class AuthService {

  login(username, password) {
    // We call the server to log the user in.
    return when(request({
      url: '/api/authenticate',
      method: 'POST',
      crossOrigin: true,
      type: 'json',
      data: {
        userid: username,
        password: password
      }
    }))
    .then(function(response) {
        // We get a JWT back.
        let jwt = response.token;
        // We trigger the LoginAction with that JWT.
        LoginActions.loginUser(jwt);
        return true;
    });
  }
}

export default new AuthService()