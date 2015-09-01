import NeighbourhoodActionTypes from '../constants/NeighbourhoodActionTypes';
import BaseStore from './BaseStore';

class NeighbourhoodStore extends BaseStore {

  constructor() {
    super();
    console.log('NeighbourhoodStore.constructor()');
    this.subscribe(() => this._registerToActions.bind(this));
    this._neighbourhoods = null;
    this._searchedNeighbourhood = null;
  }

  _registerToActions(action) {
    console.log('NeighbourhoodStore._registerToActions()| dispatchToken:', action);
    switch(action.type) {
      case NeighbourhoodActionTypes.LOAD_NEIGHBOURHOOD:
        this._neighbourhoods = action.neighbourhoods;
        this.emitChange();
        break;
      case NeighbourhoodActionTypes.SEARCH_NEIGHBOURHOOD:
        this._searchedNeighbourhood = action.neighbourhood;
        this.emitChange();
        break;
      default:
        break;
    }
  }

  getNeighbourhoods() {
    return this._neighbourhoods;
  }

  getSearchedNeighbourhood() {
    return this._searchedNeighbourhood;
  }
}

export default new NeighbourhoodStore();
