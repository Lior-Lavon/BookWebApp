const express = require('express');
const bookController = require('../controllers/bookController_Mongo');

const bookRouter = express.Router();

const router = (nav) => {
  const { middleware, getIndex, getById } = bookController(nav);
  // protect bookRouter => allow only logged in users to continue
  // check if the user is loged in,
  bookRouter.use(middleware);
  bookRouter.route('/')
    .get(getIndex);
  bookRouter.route('/:id')
    // use middleware on 'all' traffic to interrupt the request before the 'get' request
    .get(getById);
  return bookRouter;
};

module.exports = router;
