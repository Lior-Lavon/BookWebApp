
// const debug = require('debug')('app:bookController_RDS');
const conn = require('../db/rdsConnection');

const getBookArray = () => {
  const promise = new Promise((resolve) => {
    conn.query('SELECT * from books', (error, results) => {
      if (error) throw error;
      resolve(results);
    });
  });
  return promise;
};

const getBookById = (bookId) => {
  const promise = new Promise((resolve) => {
    conn.query(`SELECT * from books where id=${bookId}`, (error, results) => {
      if (error) throw error;
      resolve(results[0]);
    });
  });
  return promise;
};

const bookController = (bookService, nav) => {
  const getIndex = ((req, res) => {
    (async function query() {
      const books = await getBookArray();
      res.render(
        'bookListViewRDS', // render bookListView.ejs in view
        {
          title: 'Library',
          nav,
          books
        }
      );
    }());
  });
  const middleware = ((req, res, next) => {
    if (req.user) { // pasport has added a user to the request , All good
      next(); // continue
    } else {
      res.redirect('/'); // user was not found in the request
    }
  });
  const renderViewById = ((req, res) => {
    res.render(
      'bookViewRDS', // render bookView.ejs in view
      {
        title: 'Library',
        nav,
        book: req.book
      }
    );
  });
  const getById = ((req, res, next) => {
    const { id } = req.params; // express puts "/:id" into req.params
    (async function query() {
      // get the book from the RDS
      const book = await getBookById(id);
      // get extra details about the book from gooReadsService API
      book.details = await bookService.getBookById(book.bookId);

      req.book = book;
      next();
    }());
  });
  // Revealing module pattern - Expose the internal functions
  return {
    getIndex,
    middleware,
    getById,
    renderViewById
  };
};

module.exports = bookController;
