import Dispatcher from '../dispatchers/Dispatcher';
import NeighbourhoodActionTypes from '../constants/NeighbourhoodActionTypes';

export default {
  fetchNeighbourhood: (neighbourhoods) => {
    console.log('NeighbourhoodAction.fetchNeighbourhood()| fetched neighbourhoods:', neighbourhoods);

    if(neighbourhoods) {
      Dispatcher.dispatch({
        type: NeighbourhoodActionTypes.FIND_NEIGHBOURHOOD,
        neighbourhoods: neighbourhoods
      });
    } else {
      console.log('NeighbourhoodAction.fetchNeighbourhood()| Fetch Fail!!!');
    }
  }
};
