import React from 'react';
import {DefaultRoute, NotFoundRoute, Route} from 'react-router';
import App from '../components/App';
import LoginPage from '../components/LoginPage';
import HomePage from '../components/UserHomePage';
import RegisterPage from '../components/RegisterPage';
import SetPassword from '../components/SetPassword';
import NeighbourhoodPage from '../components/NeighbourhoodPage';
import MapPage from '../components/MapPage';
import NotFound from '../components/NotFoundPage';

module.exports = [
    <Route path="/" handler={App} >
      <DefaultRoute handler={HomePage} />
      <Route name="login" path="/login" handler={LoginPage}/>
      <Route name="home" handler={HomePage}/>
      <Route name="register" path="/register" handler={RegisterPage}/>
      <Route name="neighbourhood" path="/neighbourhood" handler={NeighbourhoodPage}/>
      <Route name="map" path="/map" handler={MapPage}/>
      <Route name="about" path="/notfound" handler={NotFound}/>
      <Route name="contact" path="/notfound" handler={NotFound}/>
      <Route name="privacy" path="/notfound" handler={NotFound}/>
      <Route name="notfound" path="/notfound" handler={NotFound}/>
      <NotFoundRoute handler={NotFound}/>
    </Route>
];