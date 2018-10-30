const express = require('express');
const chalk = require('chalk');
const debug = require('debug')('app:authRoutes');
const { MongoClient } = require('mongodb');

const authRouter = express.Router();

const router = () => {
  authRouter.route('/signUp')
    .post((req, res) => {
      debug(req.body);
      res.json(req.body);
    });
  return authRouter;
};

module.exports = router;
