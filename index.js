/* jshint esversion: 6 */

var express = require('express');
var cookieParser = require('cookie-parser');
var users = require('./users/usersHandler.js');

var app = express();

var multer = require('multer');                     // writes a file received
var uploadFolder = multer({dest: 'uploads/'});   // define destination folder

var fs = require('fs');                                        // File system
const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res, next) => {
  console.log("get 1");
  next();
});

// call to users
app.use('/users', users);

app.use(cookieParser());
app.use(express.static('./public_html'));

// log cookies always
app.all('/*', (req, res, next) => {
  console.log("Cookies: " + req.cookies);
  next();
});

// Set Cookie
app.get('/setCookie', (req, res) => {
  res.cookie('myCookie', 'data');
  res.end("cookie set");
});


// call to ping
app.get('/ping', (req, res) => {
  res.set('Content-type', 'text/html');
  res.send("pong");
  res.end();
});

app.post('/uploadFile', uploadFolder.single('File1'), (req, res, next) => {
    fs.renameSync(req.file.path, req.file.destination + req.file.originalname);
    console.log(req.file);
    res.end('done');
});


// Main
app.get('/', (req, res) => {
  res.redirect('index.html');
  // console.log("get 2");
  // res.send("Hello!");
});

app.listen(3030);
