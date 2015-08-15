import http from 'superagent';
import LoginActions from '../actions/LoginAction';
class AuthService {

  login(username, password, errorCb) {
    console.log('AuthService.login()| Trying login user with', username, password);


    http.post('/api/authenticate')
    .type('form')
    .send({
      userid: username,
      password: password
    })
    .set('Accept', 'application/json')
    .end((err, response) => {
      console.log('AuthService.login()|  err, response', err, response);
      if(!err && response && response.body && response.body.success) {
        console.log('AuthService.login()| Authentication success!!!');
        // We get a JWT back.
        let jwt = response.body.token;
        // We trigger the LoginAction with that JWT.
        LoginActions.loginUser(jwt);
        return true;
      } else {
        console.log('AuthService.login()| Authentication Fail!!!');
        errorCb();
      }
    });
    // We call the server to log the user in.
    /*
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
        console.log('AMIT AuthService', response);
        // We get a JWT back.
        let jwt = response.token;
        // We trigger the LoginAction with that JWT.
        LoginActions.loginUser(jwt);
        return true;
    });*/
  }

  logout() {
    LoginActions.logoutUser();
  }
}

export default new AuthService();
