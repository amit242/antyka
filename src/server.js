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
import Router, {Route} from 'react-router';
import appRoutes from './routes/Routes';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import HomePage from './components/UserHomePage';
import Nodemailer from 'nodemailer';

const server = express();

server.set('port', (process.env.PORT || 5000));
server.use(express.static(path.join(__dirname, 'public')));

// db token seed
server.set('superSecret', dbConfig.secret); // secret variable

// use body parser so we can get info from POST and/or URL parameters
server.use(bodyParser.urlencoded({ extended: false }));
server.use(bodyParser.json());

// TODO: move transporter to a diff file
//--------------------------------------------------------------------------------
// creating transporter for sending email.
//--------------------------------------------------------------------------------
var transporter = Nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'closyaar@gmail.com',
        pass: 'antyka@gmail.com'
    }
});
//--------------------------------------------------------------------------------

// db connection
mongoose.connect(dbConfig.database);
let mongoDB = mongoose.connection;

mongoDB.on('error', console.error.bind(console, 'connection error:'));

/*mongoDB.on('error', function callback (){
  console.log('Server.mongoDB.onError()| mongoDB connection error', arguments);
});*/

mongoDB.once('open', function callback(){
  console.log('Server.mongoDB.once()| mongoDB CONNECTED');
});
// console.log('superSecret:', server.get('superSecret'));
//
// Register API middleware
// -----------------------------------------------------------------------------
server.use('/routeapi/query', require('./routeApi/query'));
//
// Register API authentication
// -----------------------------------------------------------------------------
// TODO: refactor and move to a module/class
// -----------------
// utility functions
function expiresInMins(minutes) {
  let d1 = new Date();
  return new Date(d1.getTime() + minutes*60000);
}
// -----------------
let apiRoutes = express.Router();
// console.log('apiRoutes:', apiRoutes);
apiRoutes.get('/', function(req, res) {
  res.json({ message: 'Welcome to the coolest API on earth!' });
});

apiRoutes.post('/signup', function(req, res) {
  let name = req.body.name;
  let email = req.body.email;
  let address = req.body.address;
  console.log('server.post()| REST call /signup, request body:', req.body);

  userModel.findOne({
    userid: email
  }, function(err, user) {

    if (err) {
      throw err;
    }

    if (!user) {
      console.log('server.post()| REST call /signup, creating new user...');

      let minExpire = 10; // expires in 10 min
      let expires = expiresInMins(minExpire);

      user = {
        userid: email,
        email: email,
        name: name,
        address: address
      }


      let signObj = {
        user: user,
        expires: expires // this acts a token differentiator
      };
      let token = jwt.sign(signObj, server.get('superSecret'), {
          //expiresInMinutes: minExpire //never expires
      });

      user.jwt = token;

      let newUser = new userModel(user);

      console.log("server.post()| REST call /signup: trying to add:", newUser);

      newUser.save(function(error, result) {
        if(error) {
          console.log("server.post()| REST call /signup: Error during save:", error);
          throw error;
        }
        console.log("server.post()| REST call /signup: Inserted a document into the user collection:", result);

        let host = req.headers.host;
        console.log("server.post()| REST call /signup: server host:", host);
        // setup e-mail data with unicode symbols
        let mailOptions = {
            from: 'Closyaar<closyaar@gmail.com>', // sender address
            to: result.email, // list of receivers
            subject: 'Welcome to Closyaar', // Subject line
            text: '', // plaintext body
            html: '<div>Hello <b>' + result.name + '</b>,<p>Please <a href="http://' + host + '/signup?key=' + result.jwt 
            + '">Complete your registration</a> to <a href="http://' + host + '">Closyaar</a></p>'
            + '<p>Looking forward to see you,<br><b>Closyaar Team</b></p></div>' // html body
        };

        // send mail with defined transport object
        transporter.sendMail(mailOptions, function(error, info){
            if(error) {
                console.log('server.post()| Email ERROR:', error);
            } else {
                console.log('server.post()| Email sent: ', info.response);
            }
        });
      });


      res.json({ success: true, message: 'User signup success!!!' });
    } else {
      res.json({ success: false, message: 'User already exists, did you forget your password?' }); // TODO: send error code instead of msg
    }
  });
});

apiRoutes.post('/authenticate', function(req, res) {
  let userid = req.body.userid;
  let password = req.body.password;
  // console.log('authenticate:', req.body);

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
        console.log('Server.apiRoutes.post()| Login Success for user:', user.name);
        // if user is found and password is right
        // create a token
        let minExpire = 10; // expires in 10 min
        let expires = expiresInMins(minExpire);

        let signObj = {
          user: user.userid,
          name: user.name,
          id: user._id,
          expires: expires // this acts a token differentiator
        };
        let token = jwt.sign(signObj, server.get('superSecret'), {
          //expiresInMinutes: minExpire //never expires
        });

        // return the information including token as JSON
        res.json({
          success: true,
          message: 'Login Success!',
          name: user.name,
          //expires: expires,
          token: token
        });
      }
    }
  });
});

apiRoutes.post('/changepassword', function(req, res) {
  let mongoDBUserId = req.body.id;
  let token = req.body.token;
  console.log('server.REST.POST.changepassword()| userid, token:', mongoDBUserId, token);

  userModel.findOne({
    _id: mongoDBUserId
  }, function(err, user) {

    if (err) {
      console.log('server.REST.POST.changepassword()| DB error:', err);
      return res.status(403).json({ success: false, message: 'Password reset failed. database exception.' });
    }

    if (!user) {
      res.status(403).json({ success: false, message: 'Password reset failed. User not found.' });
    } else if (user) {

      console.log('server.REST.POST.changepassword()| trying to authenticate token:', token);

      jwt.verify(token, user.jwt, function(jwtError, decoded) {
        if (jwtError) {
          return res.status(403).json({ success: false, message: 'Password reset failed. Failed to authenticate token.' });
        } else {
          console.log('server.REST.POST.changepassword()| token verified... decoded user:', decoded);
          // TODO: ALERT!!!! this is not at all secure, just pseudo security.
          let query = {_id: decoded._id};
          
          userModel.findOneAndUpdate(query, { $set: { jwt: undefined, password: decoded.password }}, (updateError, numRow) => {
            console.log('server.REST.POST.changepassword()| mongoDB update:', numRow, updateError);
            if (updateError) {
              return res.status(500).json({ success: false, message: 'Password reset failed. Failed to authenticate token.', error: updateError });
            }
            return res.status(200).json({ success: true, message: 'Password reset Successful!!!'});
          });


          // console.log('Auth Success decoded:', decoded);
        }
      });
    }
  });
});

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
        // console.log('Auth Success decoded:', decoded);
        req.decoded = decoded;
        req.token = token;
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

apiRoutes.get('/verify', function(req, res) {
  console.log('Server.apiRoutes() REST Call to /verify:', req.decoded);
  let validUser = {
    verified: true,
    user: req.decoded.user,
    name: req.decoded.name
  }
  res.json(validUser);
});

apiRoutes.get('/verifyusertoken', function(req, res) {
  let token = req.body.token || req.query.token || req.headers['x-closyaar-access-token'];
  console.log('Server.apiRoutes() REST Call to /verifyusertoken token==>', token);
  let userID = req.decoded.user.userid;
  

  userModel.findOne({
    userid: userID
  }, function(err, user) {

    if (err) {
      throw err;
    }

    if (!user) {
      res.status(403).json({ success: false, message: 'Authentication failed. User not found.' });
    } else {
      // check if jwt matches
      if (user.jwt !== token) {
        res.status(403).json({ success: false, message: 'Authentication failed. Token did not match.' });
      } else {
        console.log('Server.apiRoutes() REST Call to /verifyusertoken: Authentication success...');
        // TODO: verify expiry
        return res.status(200).send({
          success: true,
          user: user
        });
      }
    }
  });
});

apiRoutes.get('/users', function(req, res) {
  // console.log('get users called');

  userModel.find({}).exec(function(err, users) {
    if(err) {
      // console.log('user mongoDB error:', err);
    }
    // console.log('getting users', users);
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
  let dt = new Date();
  console.log('=============================================');
  console.log('server.server.get()| render start...', dt.getHours() + ':' + dt.getMinutes() + ':' + dt.getSeconds() + ':' +  dt.getMilliseconds());
  try {
    let isMobile = ClientDetection.isMobile(req.headers['user-agent']);
    // console.log('Serverjs AMIT: isMobile:', isMobile);
    // TODO: Temporary fix #159
    // if (['/about', '/privacy'].indexOf(req.path) !== -1) {
    //   console.log('dd');
    //   await db.getPage(req.path);
    // }
    let notFound = false;
    let css = [];
    let data = {description: ''};
    /*
    let app = (<App
      path={req.path}
      isMobile={isMobile}
      context={{
        onInsertCss: value => css.push(value),
        onSetTitle: value => {data.title = value; },
        onSetMeta: (key, value) => data[key] = value,
        onPageNotFound: () => notFound = true
      }} />);

    data.body = React.renderToString(app);
    data.css = css.join('');
    
    let html = template(data);
    if (notFound) {
      res.status(404);
    }
    res.send(html);*/
    /*
    var appRoutes = (
      <Route path="/" handler={App}>
          <Route name="login" handler={LoginPage}/>
          <Route name="register" handler={RegisterPage}/>
          <Route name="home" handler={HomePage}/>
      </Route>
    );*/
    console.log('server.server.get()| req.url:', req.url);
    var router = Router.create({
      location: req.url,
      routes: appRoutes,
      onAbort: function (abortReason) {
        console.log('server.Router.create().onAbort()| reason:', abortReason);
        console.log('server.Router.create().onAbort()| instance of ', abortReason.constructor.name);
        if (abortReason.constructor.name === 'Redirect') {
          let url = this.makePath(abortReason.to, abortReason.params, abortReason.query);

          console.log('server.Router.create().onAbort()| url: [', url, '] requrl:', req.url);
          res.redirect(url);
          
        } else {
          // TODO: review logic here
          if(abortReason.reason === 'NOTLOGGED') {
            let url = this.makePath('login');
            res.redirect(url);
          }
        }
        
      },
      onError: function (err) {
        console.log('server.Router.create().onError()| err, arguments:', err, arguments);
      }
    });

    console.log('server.server.get()| router created...');
    router.run(function(Handler, state) {
      console.log('server.Router.run()| router running...');
      console.log('server.Router.run()| router Query params:', state.query);
      
      data.body = React.renderToString(<Handler query={state.query} context={{
        onInsertCss: value => css.push(value),
        onSetTitle: value => {data.title = value; },
        onSetMeta: (key, value) => data[key] = value,
        onPageNotFound: () => notFound = true
      }} />);
      data.css = css.join('');
      let html = template(data);
      if (notFound) {
        res.status(404);
      }
      res.send(html);
      // --------------------
      let dt = new Date();
      console.log('server.server.get()| render end...', dt.getHours() + ':' + dt.getMinutes() + ':' + dt.getSeconds() + ':' +  dt.getMilliseconds());
      console.log('-------------------------------------------------');
      // --------------------
    });

  } catch (err) {
    // console.log('AMIT: server exception:', err);
    next(err);
  }
});

//
// Launch the server
// -----------------------------------------------------------------------------

server.listen(server.get('port'), () => {
  // console.log('AMIT: Listening to port:', server.get('port'));
  if (process.send) {
    // console.log('AMIT: going online');
    process.send('online');
  } else {
    // console.log('The server is running at http://localhost:' + server.get('port'));
  }
});
