const express = require('express');
const chalk = require('chalk');
const morgan = require('morgan');
const debug = require('debug')('app'); // 'app' will be used for debug info printing
const path = require('path');

const app = express();

app.use(morgan('tiny')); // [combined | tiny]

// define the /public folder to serve global content css/js using express
app.use(express.static(path.join(__dirname, '/public'))); 
// if the file does not exist in /public search in the following directories
app.use('/css', express.static(path.join(__dirname, '/node_modules/bootstrap/dist/css')));
app.use('/js', express.static(path.join(__dirname, '/node_modules/bootstrap/dist/js')));
app.use('/js', express.static(path.join(__dirname, '/node_modules/jquery/dist')));

// basic routing
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views/index.html'));
});

app.listen(3000, ()=>{
    debug(`Listsning on port ${chalk.green('3000')}`);
});