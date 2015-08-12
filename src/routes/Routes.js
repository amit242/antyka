import React from 'react';
import {DefaultRoute, NotFoundRoute, Route} from 'react-router';
import App from '../components/App';
import LoginPage from '../components/LoginPage';
import HomePage from '../components/UserHomePage';

module.exports = [
    <Route handler={App} path="/">
      <DefaultRoute handler={HomePage} />
      <Route name="login" path="/login" handler={LoginPage}/>
      <Route name="home" handler={HomePage}/>
    </Route>
];