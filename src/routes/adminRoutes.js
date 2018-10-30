const express = require('express');
const debug = require('debug')('app:adminRoutes');
const { MongoClient } = require('mongodb');

const adminRouter = express.Router();

const router = () => {
  const books = [];

  adminRouter.route('/')
    .get((req, res) => {
      const url = 'mongodb://localhost:27017';
      const dbName = 'libraryApp';

      (async function mongo() {
        let clientConn;
        try {
          // open client connection to mongo
          clientConn = await MongoClient.connect(url);

          debug('connected to Mongo establish');
          // get the db
          const db = clientConn.db(dbName);

          // create if not exist a collection (mongo table)
          const response = await db.collection('books').insertMany(books);
          res.json(response); // format the output as json and send it back to the browser
        } catch (err) {
          debug(err.stack);
        }

        // close connection
        clientConn.close();
      }());

      res.send('inserting books');
    });
  return adminRouter;
};

module.exports = router;
