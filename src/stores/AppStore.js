/*! React Starter Kit | MIT License | http://www.reactstarterkit.com/ */

import EventEmitter from 'events';
import Dispatcher from '../dispatchers/Dispatcher';
import ActionTypes from '../constants/ActionTypes';
import BaseStore from './BaseStore';

const CHANGE_EVENT = 'change';
var pages = {};
var loading = false;

class AppStore extends BaseStore {
  constructor() {
    super();
    console.log('AppStore.constructor()');
    this.subscribe(() => this._registerToActions.bind(this));
    this._user = null;
    this._jwt = null;
  }
  
  getPage(path) {
    return path in pages ? pages[path] : null;
  }
  
  isLoading() {
    return loading;
  }
  
  _registerToActions(action) {
    console.log('AppStore._registerToActions()| dispatchToken:', action);
    switch (action.type) {
      case ActionTypes.GET_PAGE:
        loading = true;
        this.emitChange();
        break;

      case ActionTypes.RECEIVE_PAGE:
        loading = false;
        if (!action.err) {
          console.log('AppStore._registerToActions()| action.page.path:', action.page.path);
          pages[action.page.path] = action.page;
        }
        this.emitChange();
        break;

      default:
      // Do nothing
    }
  }
}

export default new AppStore();
