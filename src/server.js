/*! React Starter Kit | MIT License | http://www.reactstarterkit.com/ */

import 'babel/polyfill';
import _ from 'lodash';
import fs from 'fs';
import path from 'path';
import express from 'express';
import React from 'react';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import jwt from 'jsonwebtoken';
//import './dispatchers/Dispatcher';
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

// use body parser so we can get info from POST and/or URL parameters
server.use(bodyParser.urlencoded({ extended: false }));
server.use(bodyParser.json());

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
//
// Register API authentication
// -----------------------------------------------------------------------------
// TODO: refactor and move to a module/class
let apiRoutes = express.Router();
console.log('apiRoutes:', apiRoutes);
apiRoutes.get('/', function(req, res) {
  res.json({ message: 'Welcome to the coolest API on earth!' });
});

apiRoutes.post('/authenticate', function(req, res) {
  let userid = req.body.userid;
  let password = req.body.password;
  console.log('authenticate:', req.body);

  userModel.findOne({
    userid: userid
  }, function(err, user) {

    if (err) {
      throw err;
    }

    if (!user) {
      res.json({ success: false, message: 'Authentication failed. User not found.' });
    } else if (user) {
      // check if password matches
      if (user.password !== password) {
        res.json({ success: false, message: 'Authentication failed. Wrong password.' });
      } else {
        // if user is found and password is right
        // create a token
        let minExpire = 10; // expires in 10 min
        let expires = expiresInMinutes(minExpire);

        let signObj = {
          user: user.userid,
          id: user._id,
          expires: expires
        };
        let token = jwt.sign(signObj, server.get('superSecret'), {
          expiresInMinutes: minExpire
        });

        // return the information including token as JSON
        res.json({
          success: true,
          message: 'Login Success!',
          token: token,
          expires: expires
        });
      }
    }
  });
});

function expiresInMinutes(minutes) {
  let d1 = new Date();
  return new Date(d1.getTime() + minutes*60000);
}

// route middleware to verify a token
// all requests after this will be authenticated via token
apiRoutes.use(function(req, res, next) {

  // check header or url parameters or post parameters for token
  let token = req.body.token || req.query.token || req.headers['x-closyaar-access-token'];

  // decode token
  if (token) {
    // verifies secret and checks exp
    jwt.verify(token, server.get('superSecret'), function(err, decoded) {
      if (err) {
        return res.status(403).json({ success: false, message: 'Failed to authenticate token.' });
      } else {
        // if everything is good, save to request for use in other routes
        console.log('Auth Success decoded:', decoded);
        req.decoded = decoded;
        next();
      }
    });

  } else {

    // if there is no token
    // return an error
    return res.status(403).send({
        success: false,
        message: 'No token provided.'
    });
  }
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
    console.log('Serverjs AMIT: isMobile:', isMobile);
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
