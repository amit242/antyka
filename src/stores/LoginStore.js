import ActionTypes from '../constants/ActionTypes';
import BaseStore from './BaseStore';
//import jwt_decode from 'jwt-decode';


class LoginStore extends BaseStore {

  constructor() {

    super();
    console.log('LoginStore.constructor()');
    this.subscribe(() => this._registerToActions.bind(this));
    this._user = null;
    this._jwt = null;
    this._isloggedin = null;
  }

  _registerToActions(action) {
    console.log('LoginStore._registerToActions()| dispatchToken:', action.type);
    switch(action.type) {
      case ActionTypes.LOGIN_USER:
        //console.log('AMIT LOGINSTORE: emitchange with jwt', action.jwt);
        this._jwt = action.jwt;
        this._user = action.user;
        this._isloggedin = true;
        //this._user = jwt_decode(this._jwt);
        this.emitChange();
        break;
      case ActionTypes.LOGOUT_USER:
        this._user = null;
        this._isloggedin = false;
        this.emitChange();
        break;
      case ActionTypes.SIGNUP_USER:
        this._user = action.user;
        this.emitChange();
        break;
      case ActionTypes.TOKEN_VERIFIED:
        this._user = action.user;
        this.emitChange();
      default:
        break;
    }
  }

  get user() {
    return this._user;
  }

  get jwt() {
    return this._jwt;
  }

  isLoggedIn() {
    console.log('LoginStore.isLoggedIn()| :', this._isloggedin);
    return this._isloggedin;
  }
}

export default new LoginStore();
