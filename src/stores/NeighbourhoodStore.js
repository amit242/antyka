import NeighbourhoodActionTypes from '../constants/NeighbourhoodActionTypes';
import BaseStore from './BaseStore';

class NeighbourhoodStore extends BaseStore {

  constructor() {
    super();
    console.log('NeighbourhoodStore.constructor()');
    this.subscribe(() => this._registerToActions.bind(this));
    this._neighbourhoods = null;
  }

  _registerToActions(action) {
    console.log('NeighbourhoodStore._registerToActions()| dispatchToken:', action);
    switch(action.type) {
      case NeighbourhoodActionTypes.FIND_NEIGHBOURHOOD:
        this._neighbourhoods = action.neighbourhoods;
        this.emitChange();
        break;
      default:
        break;
    }
  }

  getNeighbourhoods() {
    return this._neighbourhoods;
  }
}

export default new NeighbourhoodStore();
