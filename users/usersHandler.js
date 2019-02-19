/**
 *  Users Handler
 *
 */

/* jshint esversion: 6 */
var express = require('express');
var router = express.Router();

var MongoConnector = require('../MongoConnector.js');
var UserModel = require('./UserModel.js');

var app = express();

//  INSERT USER
router.post('/insertUser', (req, res, next) => {
  var connector = new MongoConnector((err) => {
    UserModel.insertUser(connector, req.body, (err, mongoRes) => {
        console.log(mongoRes.result);
        connector.close();

        res.setHeader('Content-Type', 'application/json');
        res.status(201).send(JSON.stringify({response: "USER_INSERTED"}));
    });
  });
});

router.get('/', (res, req, next) => {
 res.send('Users hello');
});

/**
 *   Get all users from the database
 */
router.get('/getUsers', (req, res, next) => {
  var connector = new MongoConnector((err) => {
    var users_ = UserModel.getAllUsers(connector, (docs) => {
      connector.close();

      res.setHeader('Content-Type', 'application/json');
      res.status(200).send(JSON.stringify({response: docs}));
    });
  });
});

/**
 *  Get a specific User form the database
 */
router.post('/getUser', (req, res, next) => {
  var connector = new MongoConnector((err) => {
    var email = req.body.email;
    console.log(req.body.email);

    if(email) {
      UserModel.getUser(connector, email, (docs) => {
          connector.close();

          // Element not found
          if(docs === "NOT_FOUND") {
            res.setHeader('Content-Type', 'application/json');
            res.status(404).send(JSON.stringify({response: "NOT_FOUND"}));
          }
          else {
            res.setHeader('Content-Type', 'application/json');
            res.status(200).send(JSON.stringify({response: docs}));
          }
      });
    }
    else {
      res.setHeader('Content-Type', 'application/json');
      res.status(422).send(JSON.stringify({response: "Missing the email Parameter"}));
    }
  });
});

// EDIT PROFILE
router.put('/editProfile', (req, res, next) => {
  var email = req.body.email;

  // If values needed are received
  if(email) {
    var connector = new MongoConnector((err) => {

      UserModel.editUser(connector, email, req.body, (docs) => {
        console.log(docs);
        connector.close();

        res.setHeader('Content-Type', 'application/json');
        res.status(201).send(JSON.stringify({response: docs}));
      });
    });
  }
  else {
    res.setHeader('Content-Type', 'application/json');
    res.status(422).send(JSON.stringify({response: "Missing the email Parameter"}));
  }
});

// DEACTIVATE USER
router.put('/deactivateUser', (req, res, next) => {
  var email = req.body.email;

  // If values needed are received
  if(email) {
    var connector = new MongoConnector((err) => {

      UserModel.editUser(connector, email, {"status": "inactive"}, (result) => {
          console.log(result);
          connector.close();

          res.setHeader('Content-Type', 'application/json');
          res.status(200).send(JSON.stringify({response: "User Deactivated"}));
      });
    });
  }
  else {
    res.setHeader('Content-Type', 'application/json');
    res.status(422).send(JSON.stringify({response: "Missing the email Parameter"}));
  }
});

// ACTIVATE
router.put('/activateUser', (req, res, next) => {
  var email = req.body.email;

  // If values needed are received
  if(email) {
    var connector = new MongoConnector((err) => {

      UserModel.editUser(connector, email, {"status": "active"}, (result) => {
          console.log(result);
          connector.close();

          res.setHeader('Content-Type', 'application/json');
          res.status(200).send(JSON.stringify({response: "User Activated"}));
      });
    });
  }
  else {
    res.setHeader('Content-Type', 'application/json');
    res.status(422).send(JSON.stringify({response: "Missing the email Parameter"}));
  }
});


// LOG IN
router.post('/login', (req, res, next) => {
  var email = req.body.email;
  var password = req.body.password;

  if(email && password) {
    var connector = new MongoConnector((err) => {

      UserModel.loginUser(connector, email, password, (result) => {
          connector.close();
          if(result === "NOT_FOUND") {
            res.setHeader('Content-Type', 'application/json');
            res.status(418).send(JSON.stringify({response: "Incorrect User or Password"}));
          }
          else {
            res.setHeader('Content-Type', 'application/json');
            res.status(200).send(JSON.stringify({response: result}));
          }
      });

    });
  }
  else {
    res.setHeader('Content-Type', 'application/json');
    res.status(422).send(JSON.stringify({response: "Missing the email or password"}));
  }
});

module.exports = router;
