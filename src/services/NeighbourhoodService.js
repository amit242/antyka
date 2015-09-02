import http from 'superagent';
import NeighbourhoodAction from '../actions/NeighbourhoodAction';

class NeighbourhoodService {

  saveNeighbourhood(neighbourhood, userid, errorCb) {
    console.log('NeighbourhoodService.loadNeighbourhoods()| neighbourhood', neighbourhood);
    let jwt = localStorage.getItem('closyaar-jwt');

    http.post('/api/neighbourhood')
    .type('form')
    .send({
      neighbourhood: JSON.stringify(neighbourhood),
      userid: userid
    })
    .set('Accept', 'application/json')
    .set('x-closyaar-access-token', jwt)
    .end((err, response) => {
      console.log('NeighbourhoodService.saveNeighbourhood()|  err, response', err, response);
      if(!err && response && response.body && response.body.success) {
        console.log('NeighbourhoodService.saveNeighbourhood()| neighbourhood created!!!');
        // TODO: call dispatcher
        return true;
      } else {
        console.log('NeighbourhoodService.saveNeighbourhood()| neighbourhood creation failed!!!');
        errorCb(err);
      }
    });
  }

  searchNeighbourhoodById(id, errorCb) {
    console.log('NeighbourhoodService.searchNeighbourhoodById()| neighbourhood', id);
    let jwt = localStorage.getItem('closyaar-jwt');

    http.get('/api/neighbourhood/' + id)
    .type('form')
    .set('Accept', 'application/json')
    .set('x-closyaar-access-token', jwt)
    .end((err, response) => {
      console.log('NeighbourhoodService.searchNeighbourhoodById()|  err, response', err, response);
      if(!err && response && response.body && response.body.success) {
        console.log('NeighbourhoodService.searchNeighbourhoodById()| neighbourhood found!!!');
        // We get a JWT back.
        ///let jwt = response.body.token;
        // We trigger the LoginAction with that JWT.
        // TODO: may want to review this
        NeighbourhoodAction.searchNeighbourhood(response.body.neighbourhoods);
        return true;
      } else {
        console.log('NeighbourhoodService.searchNeighbourhoodById()| neighbourhood search failed!!!');
        errorCb(err);
      }
    });
  }

  findNeighbourhoodsByViewport(mapViewport, errorCb) {

    console.log('NeighbourhoodService.findNeighbourhoodsByViewport()| neighbourhood', mapViewport);
    let jwt = localStorage.getItem('closyaar-jwt');

    http.get('/api/neighbourhoods')
    .type('form')
    //.send(neighbourhood)
    .set('Accept', 'application/json')
    .set('x-closyaar-access-token', jwt)
    .end((err, response) => {
      console.log('NeighbourhoodService.findNeighbourhoodsByViewport()|  err, response', err, response);
      if(!err && response && response.body && response.body.success) {
        console.log('NeighbourhoodService.findNeighbourhoodsByViewport()| neighbourhood found!!!');
        // We get a JWT back.
        ///let jwt = response.body.token;
        // We trigger the LoginAction with that JWT.
        // TODO: may want to review this
        NeighbourhoodAction.fetchNeighbourhoods(response.body.neighbourhoods);
        return true;
      } else {
        console.log('NeighbourhoodService.findNeighbourhoodsByViewport()| neighbourhood search failed!!!');
        errorCb(err);
      }
    });

  }

}

export default new NeighbourhoodService();
