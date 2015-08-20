import http from 'superagent';
import { canUseDOM } from 'react/lib/ExecutionEnvironment';
import Dispatcher from '../dispatchers/Dispatcher';
import ActionTypes from '../constants/ActionTypes';

export default {

  navigateTo(path, options) {
    console.log('AppActions.navigateTo()| path:', path);
    console.log('AppActions.navigateTo()| options:', options);
    this.loadPage(path, () => {
      if (canUseDOM) {
        if (options && options.replace) {
          window.history.replaceState({}, document.title, path);
        } else {
          window.history.pushState({}, document.title, path);
        }
      }

      Dispatcher.dispatch({
        type: ActionTypes.CHANGE_LOCATION,
        path
      });
    });
  },

  loadPage(path, cb) {
    console.log('AppActions.loadPage()| path:', path);
    Dispatcher.dispatch({
      type: ActionTypes.GET_PAGE,
      path
    });

    http.get('/routeapi/query?path=' + encodeURI(path))
      .accept('application/json')
      .end((err, res) => {
        Dispatcher.dispatch({
          type: ActionTypes.RECEIVE_PAGE,
          path,
          err,
          page: res ? res.body : null
        });
        
        if (cb) {
          cb();
        }
      });
  }

};
