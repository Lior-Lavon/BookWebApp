
const chalk = require('chalk');
const debug = require('debug')('app:authRoutes');
const { MongoClient } = require('mongodb');
const passport = require('passport');

const authController = (nav) => {
  const signUp = ((req, res) => {
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
  const signInGet = ((req, res) => {
    // show a sign in form
    res.render('signin', {
      nav,
      title: 'sign In',
    });
  });
  const signInPost = (passport.authenticate('local', {
    successRedirect: '/auth/profile',
    failureRedirect: '/'
  }));
  const profileAll = ((req, res, next) => {
    if (req.user) { // pasport has added a user to the request , all good
      next(); // continue, user object is found in the request
    } else {
      res.redirect('/'); // user was not found in the request, user is not logged in
    }
  });
  const profileGet = ((req, res) => {
    res.json(req.user);
  });
  return {
    signUp,
    signInGet,
    signInPost,
    profileAll,
    profileGet
  };
};

module.exports = authController;
