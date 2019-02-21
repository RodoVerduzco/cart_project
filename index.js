/* jshint esversion: 6 */

var express = require('express');                              // Express server framework
var cookieParser = require('cookie-parser');                     // For cookies management
var cors = require('cors');                                               // To allow CORS
var multer = require('multer');                                  // writes a file received
var fs = require('fs');                                                     // File system
const bodyParser = require('body-parser');                         // To parse the request

// User Defined
var users = require('./users/usersHandler.js');                          // Users Hanlding JS
var products = require('./products/productsHandler.js');               // Products handler JS
var transaction = require('./transactions/transactionHandler.js');  // Transaction handler JS

var app = express();
var uploadFolder = multer({dest: 'uploads/'});   // define destination folder

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.get('/', (req, res, next) => {
  console.log("get 1");
  next();
});

// call to users
app.use('/users', users);
app.use('/products', products);
app.use('/transactions', transaction);


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
