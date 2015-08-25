import React from 'react';
import {DefaultRoute, NotFoundRoute, Route} from 'react-router';
import App from '../components/App';
import LoginPage from '../components/LoginPage';
import HomePage from '../components/UserHomePage';
import RegisterPage from '../components/RegisterPage';
import SetPassword from '../components/SetPassword';
import NeighborhoodPage from '../components/NeighborhoodPage';
import MapPage from '../components/MapPage';
import NotFound from '../components/NotFoundPage';

module.exports = [
    <Route path="/" handler={App} >
      <DefaultRoute handler={HomePage} />
      <Route name="login" path="/login" handler={LoginPage}/>
      <Route name="home" handler={HomePage}/>
      <Route name="register" path="/register" handler={RegisterPage}/>
      <Route name="neighborhood" path="/neighborhood" handler={NeighborhoodPage}/>
      <Route name="map" path="/map" handler={MapPage}/>
      <NotFoundRoute handler={NotFound}/>
    </Route>
];