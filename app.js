const express = require('express');
const chalk = require('chalk');
const morgan = require('morgan');
const debug = require('debug')('app'); // 'app' will be used for debug info printing
const path = require('path');
const bodyParser = require('body-parser');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const expressSession = require('express-session');


const app = express();
// read the port from the Nodemon env param.
const port = process.env.PORT || 3000;

// define the nevigation menu items
const nav = [
  { link: '/books-rds', title: 'Book_RDS' },
  { link: '/books-mng', title: 'Book_Mongo' },
  { link: '/authors', title: 'Author' }
];
const bookRouterRDS = require('./src/routes/bookRoutes_RDS')(nav);
const bookRouterMongo = require('./src/routes/bookRoutes_Mongo')(nav);
const adminRouter = require('./src/routes/adminRoutes')();
const authRouter = require('./src/routes/authRoutes')(nav);

app.use(morgan('tiny')); // [combined | tiny]

// Middleware - get the body and append to the req.body flag
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// include the use of cookieParser & expressSession
app.use(cookieParser());
app.use(expressSession({ secret: 'library' }));

// passport authentication configuration
require('./src/config/passport')(app);

// middleware function
app.use((req, res, next) => {
  // debug('my middleware');
  next();
});

// define the /public folder to serve global content css/js using express
app.use(express.static(path.join(__dirname, '/public')));
// if the file does not exist in /public search in the following directories
app.use('/css', express.static(path.join(__dirname, '/node_modules/bootstrap/dist/css')));
app.use('/js', express.static(path.join(__dirname, '/node_modules/bootstrap/dist/js')));
app.use('/js', express.static(path.join(__dirname, '/node_modules/jquery/dist')));

// set the views location in the source code
app.set('views', './src/views');
app.set('view engine', 'ejs');

app.use('/books-rds', bookRouterRDS); // pass in 'nav' as configuration data
app.use('/books-mng', bookRouterMongo); // pass in 'nav' as configuration data
app.use('/admin', adminRouter);
app.use('/auth', authRouter);

// main routing
app.get('/', (req, res) => {
  // express is looking for 'index.ejs' file inside 'views' -> './src/views'
  res.render('index', {
    title: 'Library',
    nav
  });
});

app.listen(port, () => {
  debug(`Express: Listsning on port ${chalk.green(port)}`);
});
