/*! React Starter Kit | MIT License | http://www.reactstarterkit.com/ */

import 'babel/polyfill';
import _ from 'lodash';
import fs from 'fs';
import path from 'path';
import express from 'express';
import React from 'react';
import mongoose from 'mongoose';
//import jwt from 'jsonwebtoken';
//import './core/Dispatcher';
//import './stores/AppStore';
import db from './core/Database';
import App from './components/App';
import ClientDetection from './utils/ClientDetection';
import dbConfig from './database/config';
import userModel from './models/user';


const server = express();

server.set('port', (process.env.PORT || 5000));
server.use(express.static(path.join(__dirname, 'public')));

// db token seed
server.set('superSecret', dbConfig.secret); // secret variable
// db connection
mongoose.connect(dbConfig.database);
let mongoDB = mongoose.connection;
mongoDB.on('error', console.error.bind(console, 'connection error:'));
mongoDB.once('open', function callback(){
    console.log('CONNECTED');
});
console.log('superSecret:', server.get('superSecret'));
//
// Register API middleware
// -----------------------------------------------------------------------------
server.use('/api/query', require('./api/query'));
let apiRoutes = express.Router();
console.log('apiRoutes:', apiRoutes);
apiRoutes.get('/', function(req, res) {
  res.json({ message: 'Welcome to the coolest API on earth!' });
});
apiRoutes.get('/users', function(req, res) {
  console.log('get users called');
  
  userModel.find({}).exec(function(err, users) {
    if(err) {
      console.log('user mongoDB error:', err);
    }
    console.log('getting users', users);
    res.json(users);
  });
});
server.use('/api', apiRoutes);
//
// Register server-side rendering middleware
// -----------------------------------------------------------------------------

// The top-level React component + HTML template for it
const templateFile = path.join(__dirname, 'templates/index.html');
const template = _.template(fs.readFileSync(templateFile, 'utf8'));

server.get('*', async (req, res, next) => {
  try {
    let isMobile = ClientDetection.isMobile(req.headers['user-agent']);
    console.log('AMIT: isMobile:', isMobile);
    // TODO: Temporary fix #159
    if (['/about', '/privacy'].indexOf(req.path) !== -1) {
      await db.getPage(req.path);
    }
    let notFound = false;
    let css = [];
    let data = {description: ''};
    let app = (<App
      path={req.path}
      isMobile={isMobile}
      context={{
        onInsertCss: value => css.push(value),
        onSetTitle: value => {data.title = value; console.log('AMIT: title value:', value); },
        onSetMeta: (key, value) => data[key] = value,
        onPageNotFound: () => notFound = true
      }} />);
    data.body = React.renderToString(app);
    data.css = css.join('');
    let html = template(data);
    if (notFound) {
      res.status(404);
    }
    res.send(html);
  } catch (err) {
    console.log('AMIT: server exception:', err);
    next(err);
  }
});

//
// Launch the server
// -----------------------------------------------------------------------------

server.listen(server.get('port'), () => {
  console.log('AMIT: Listening to port:', server.get('port'));
  if (process.send) {
    console.log('AMIT: going online');
    process.send('online');
  } else {
    console.log('The server is running at http://localhost:' + server.get('port'));
  }
});
