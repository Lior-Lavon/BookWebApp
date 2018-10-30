const express = require('express');
const chalk = require('chalk');
const debug = require('debug')('app:authRoutes');
const { MongoClient } = require('mongodb');
const passport = require('passport');

const authRouter = express.Router();

const router = (nav) => {
  authRouter.route('/signUp')
    .post((req, res) => {
      // create user in the database
      const { username, password } = req.body;
      const url = 'mongodb://localhost:27017';
      const dbName = 'libraryApp';

      (async function addUser() {
        let clientConn;
        try {
          // open client connection to mongoDB
          clientConn = await MongoClient.connect(url);

          debug(chalk.green('connected to Mongo establish'));

          // get the db
          const db = clientConn.db(dbName);

          const collection = await db.collection('users');
          const user = { username, password };

          // Insert the user to the collection
          const results = await collection.insertOne(user);

          // login the user
          req.login(results.ops[0], () => {
            res.redirect('/auth/profile');
          });
        } catch (err) {
          debug(err.stack);
        }

        // close connection
        clientConn.close();
      }());
    });
  authRouter.route('/signin')
    .get((req, res) => {
      // show a sign in form
      res.render('signin', {
        nav,
        title: 'sign In',
      });
    })
    .post(passport.authenticate('local', {
      successRedirect: '/auth/profile',
      failureRedirect: '/'
    }));

  // tell passport to use the local strategy to authenticate the user
  authRouter.route('/profile') // add middleware to check if the user is signed in
    .all((req, res, next) => {
      if (req.user) { // pasport has added a user to the request , all good
        next(); // continue, user object is found in the request
      } else {
        res.redirect('/'); // user was not found in the request, user is not logged in
      }
    })
    .get((req, res) => {
      res.json(req.user);
    });
  return authRouter;
};

module.exports = router;
