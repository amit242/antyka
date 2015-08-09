import http from 'superagent';
import LoginActions from '../actions/LoginAction';
class AuthService {

  login(username, password) {
    console.log('AMIT Trying login with', username, password);


    http.post('/api/authenticate')
    .type('form')
    .send({
      userid: username,
      password: password
    })
    .set('Accept', 'application/json')
    .end((err, response) => {
      console.log('AMIT AuthService', err, response);
      if(!err && response && response.body && response.body.success) {
        console.log('Authentication success!!!');
        // We get a JWT back.
        let jwt = response.body.token;
        // We trigger the LoginAction with that JWT.
        LoginActions.loginUser(username, jwt);
        return true;
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
}

export default new AuthService();
