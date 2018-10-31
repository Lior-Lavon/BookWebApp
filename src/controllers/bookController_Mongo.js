const debug = require('debug')('app:bookRoutes_Mongo');
const { MongoClient, ObjectID } = require('mongodb');
const chalk = require('chalk');

const url = 'mongodb://localhost:27017';
const dbName = 'libraryApp';

const bookController = (nav) => {
  const middleware = ((req, res, next) => {
    if (req.user) { // pasport has added a user to the request , All good
      next(); // continue
    } else {
      res.redirect('/'); // user was not found in the request
    }
  });
  const getIndex = ((req, res) => {
    (async function mongo() {
      let clientConn;
      try {
        // open client connection to mongoDB
        clientConn = await MongoClient.connect(url);

        debug(chalk.green('connected to Mongo establish'));

        // get the db
        const db = clientConn.db(dbName);

        // create (if not exist) or connect to the collection (mongo table)
        const col = await db.collection('books');
        // get all the data
        const books = await col.find().toArray();
        res.render(
          'bookListViewMongo', // render bookListView.ejs in view
          {
            title: 'Library',
            nav,
            books
          }
        );
      } catch (err) {
        debug(err.stack);
      }

      // close connection
      clientConn.close();
    }());
  });
  const getById = ((req, res) => {
    const { id } = req.params; // express puts "/:id" into req.params
    (async function mongo() {
      let clientConn;
      try {
        // open client connection to mongoDB
        clientConn = await MongoClient.connect(url);

        debug(chalk.green('connected to Mongo establish'));

        // get the db
        const db = clientConn.db(dbName);

        // create (if not exist) or connect to the collection (mongo table)
        const col = await db.collection('books');
        // get all the data
        const book = await col.findOne({ _id: new ObjectID(id) });

        debug(book);

        res.render(
          'bookViewMongo', // render bookView.ejs in view
          {
            title: 'Library',
            nav,
            book
          }
        );
      } catch (err) {
        debug(err.stack);
      }

      // close connection
      clientConn.close();
    }());
  });

  return {
    middleware,
    getIndex,
    getById
  };
};

module.exports = bookController;
