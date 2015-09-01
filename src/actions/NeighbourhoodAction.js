import Dispatcher from '../dispatchers/Dispatcher';
import NeighbourhoodActionTypes from '../constants/NeighbourhoodActionTypes';

export default {
  fetchNeighbourhoods: (neighbourhoods) => {
    console.log('NeighbourhoodAction.fetchNeighbourhood()| fetched neighbourhoods:', neighbourhoods);

    if(neighbourhoods) {
      Dispatcher.dispatch({
        type: NeighbourhoodActionTypes.LOAD_NEIGHBOURHOOD,
        neighbourhoods: neighbourhoods
      });
    } else {
      console.log('NeighbourhoodAction.fetchNeighbourhood()| Fetch Fail!!!');
    }
  },

  searchNeighbourhood: (neighbourhood) => {
    console.log('NeighbourhoodAction.searchNeighbourhood()| searched neighbourhood:', neighbourhood);

    if(neighbourhood) {
      Dispatcher.dispatch({
        type: NeighbourhoodActionTypes.SEARCH_NEIGHBOURHOOD,
        neighbourhood: neighbourhood
      });
    } else {
      console.log('NeighbourhoodAction.searchNeighbourhood()| Search Fail!!!');
    }
  }
};
