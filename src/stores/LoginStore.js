import ActionTypes from '../constants/ActionTypes';
import BaseStore from './BaseStore';
//import jwt_decode from 'jwt-decode';


class LoginStore extends BaseStore {

  constructor() {

    super();
    console.log('LoginStore constructor');
    this.subscribe(() => this._registerToActions.bind(this));
    this._user = null;
    this._jwt = null;
  }

  _registerToActions(action) {
    console.log('AMIT LOGINSTORE:', action);
    switch(action.type) {
      case ActionTypes.LOGIN_USER:
        console.log('AMIT LOGINSTORE: emitchange with jwt', action.jwt);
        this._jwt = action.jwt;
        this._user = 'XXXXX';
        //this._user = jwt_decode(this._jwt);
        this.emitChange();
        break;
      case ActionTypes.LOGOUT_USER:
        this._user = null;
        this.emitChange();
        break;
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
    return !!this._user;
  }
}

export default new LoginStore();
