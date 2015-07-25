/*! React Starter Kit | MIT License | http://www.reactstarterkit.com/ */

import 'babel/polyfill';
import _ from 'lodash';
import fs from 'fs';
import path from 'path';
import express from 'express';
import React from 'react';
//import './core/Dispatcher';
//import './stores/AppStore';
import db from './core/Database';
import App from './components/App';
import ClientDetection from './utils/ClientDetection';

const server = express();

server.set('port', (process.env.PORT || 5000));
console.log(server.get('port'));
server.use(express.static(path.join(__dirname, 'public')));

//
// Register API middleware
// -----------------------------------------------------------------------------
server.use('/api/query', require('./api/query'));

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
