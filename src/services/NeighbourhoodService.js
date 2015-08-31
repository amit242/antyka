import http from 'superagent';
import NeighbourhoodAction from '../actions/NeighbourhoodAction';
import jwt from 'jsonwebtoken';

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

  findNeighbourhoodsByViewport(mapViewport) {

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
        NeighbourhoodAction.fetchNeighbourhood(response.body.neighbourhoods);
        return true;
      } else {
        console.log('NeighbourhoodService.findNeighbourhoodsByViewport()| neighbourhood search failed!!!');
        errorCb(err);
      }
    });

  }

}

export default new NeighbourhoodService();
