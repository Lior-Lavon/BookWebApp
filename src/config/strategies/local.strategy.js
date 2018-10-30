const passport = require('passport');
const { Strategy } = require('passport-local');
const { MongoClient } = require('mongodb');
const chalk = require('chalk');
const debug = require('debug')('app:local.strategy');

const localStrategy = () => {
  passport.use(new Strategy({
    usernameField: 'username',
    passwordField: 'password'
  }, (username, password, done) => {

    // compare the input fileds against the mongoDB
    // check if the username/password exist in the Mongo

    const url = 'mongodb://localhost:27017';
    const dbName = 'libraryApp';
    (async function mongo() {
      let clientConn;
      try {
        // open client connection to mongoDB
        clientConn = await MongoClient.connect(url);
        debug(chalk.green('connected to Mongo establish'));
        const db = clientConn.db(dbName);
        const collection = await db.collection('users');

        // Insert the user to the collection
        const user = await collection.findOne({ username });
        if (user.password === password) {
          done(null, user); // user found , authRouter -> successRedirect: '/auth/profile'
        } else {
          done(null, false); // user Not found, authRouter -> failureRedirect: '/'
        }
      } catch (err) {
        debug(err.stack);
      }

      // close connection
      clientConn.close();
    }());
  }));
};

module.exports = localStrategy;
