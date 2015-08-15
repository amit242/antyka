import React from 'react';
import {DefaultRoute, NotFoundRoute, Route} from 'react-router';
import App from '../components/App';
import LoginPage from '../components/LoginPage';
import HomePage from '../components/UserHomePage';
import NotFound from '../components/NotFoundPage';

module.exports = [
    <Route path="/" handler={App} >
      <DefaultRoute handler={HomePage} />
      <Route name="login" handler={LoginPage}/>
      <Route name="home" handler={HomePage}/>
      <NotFoundRoute handler={NotFound}/>
    </Route>
];