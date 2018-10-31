const express = require('express');
const authController = require('../controllers/authController');

const authRouter = express.Router();

const router = (nav) => {
  const { signUp, signInGet, signInPost, profileAll, profileGet } = authController(nav);
  authRouter.route('/signUp')
    .post(signUp);
  authRouter.route('/signin')
    .get(signInGet)
    .post(signInPost);

  // tell passport to use the local strategy to authenticate the user
  authRouter.route('/profile') // add middleware to check if the user is signed in
    .all(profileAll)
    .get(profileGet);
  return authRouter;
};

module.exports = router;
