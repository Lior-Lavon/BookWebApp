const express = require('express');
//const chalk = require('chalk');
const debug = require('debug')('app:bookRoutes_RDS');
const conn = require('../db/rdsConnection');


const bookRouter = express.Router();


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

const router = (nav) => {
  // protect bookRouter => allow only logged in users to continue
  // check if the user is loged in, 
  bookRouter.use((req, res, next) => {
    if (req.user) { // pasport has added a user to the request , All good
      next(); // continue
    } else {
      res.redirect('/'); // user was not found in the request
    }
  });
  bookRouter.route('/')
    .get((req, res) => {
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
  bookRouter.route('/:id')
    // use middleware on 'all' traffic to interrupt the request before the 'get' request
    .all((req, res, next) => {
      const { id } = req.params; // express puts "/:id" into req.params
      (async function query() {
        const book = await getBookById(id);
        req.book = book;
        next();
      }());
    })
    .get((req, res) => {
      res.render(
        'bookViewRDS', // render bookView.ejs in view
        {
          title: 'Library',
          nav,
          book: req.book
        }
      );
    });
  return bookRouter;
};

module.exports = router;
