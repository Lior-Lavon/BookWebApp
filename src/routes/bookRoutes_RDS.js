const express = require('express');
// const chalk = require('chalk');
// const debug = require('debug')('app:bookRoutes_RDS');
const bookController = require('../controllers/bookController_RDS');
const bookService = require('../services/goodReadsService');

const bookRouter = express.Router();

const router = (nav) => {
  // extract the controller function
  const { getIndex, middleware, renderViewById, getById } = bookController(bookService, nav);

  // protect bookRouter => allow only logged in users to continue
  // check if the user is loged in,
  bookRouter.use(middleware);
  bookRouter.route('/')
    .get(getIndex);
  bookRouter.route('/:id')
    // use middleware on 'all' traffic to interrupt the request before the 'get' request
    .all(getById)
    .get(renderViewById);
  return bookRouter;
};

module.exports = router;
