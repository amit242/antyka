import http from 'superagent';
import LoginActions from '../actions/LoginAction';
import jwt from 'jsonwebtoken';

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
        console.log('AuthService.login()| Authentication Failed!!!');
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

  signUp(user, errorCb) {
    console.log('AuthService.signUp()| Trying signUp user:', user);
    http.post('/api/signup')
    .type('form')
    .send(user)
    .set('Accept', 'application/json')
    .end((err, response) => {
      console.log('AuthService.signUp()|  err, response', err, response);
      if(!err && response && response.body && response.body.success) {
        console.log('AuthService.signUp()| signUp success!!!');
        // We get a JWT back.
        //let jwt = response.body.token;
        // We trigger the LoginAction with that JWT.
        LoginActions.signUpUser(user);
        return true;
      } else {
        console.log('AuthService.signUp()| signUp Failed!!!');
        errorCb(response);
      }
    });
  }

  changePassword(user, cb) {
    console.log('AuthService.changePassword()| Trying changePassword for user:', user);
    // TODO: implement SSL. For the time being doing a pseudo security

    let token = jwt.sign(user, user.jwt);

    console.log('AuthService.changePassword()| jwt:', user.jwt);
    console.log('AuthService.changePassword()| token:', token);

    http.post('/api/changepassword')
    .type('form')
    .send({
      id: user._id,
      token: token
    })
    .set('Accept', 'application/json')
    .end((err, response) => {
      console.log('AuthService.changePassword()|  err, response', err, response);
      if(!err && response && response.body && response.body.success) {
        console.log('AuthService.changePassword()| changePassword success!!!');
        // We get a JWT back.
        //let jwt = response.body.token;
        // We trigger the LoginAction with that JWT.
      } else {
        console.log('AuthService.changePassword()| changePassword Failed!!!');
      }
      cb(response.body);
    });
  }
}

export default new AuthService();
