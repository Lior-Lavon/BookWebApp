const passport = require('passport');
// include the 'local' strategy
// that is were we will put all the passport code arround 'local' strategy
// there are many other strategies like, fb or OAuth2
require('./strategies/local.strategy')(); // execute the local strategy


const passportConfig = (app) => {
  app.use(passport.initialize()); // create the login object on the request
  app.use(passport.session());

  // Store user in the session
  passport.serializeUser((user, done) => {
    done(null, user);
  });

  // Retriveves user in the session
  passport.deserializeUser((user, done) => {
    done(null, user);
  });

};

module.exports = passportConfig;
