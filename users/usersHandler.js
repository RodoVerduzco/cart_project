/**
 *  Users Handler
 *
 */

/* jshint esversion: 6 */
var multer = require('multer');    // To save Files
var express = require('express');
var router = express.Router();

var MongoConnector = require('../MongoConnector.js');
var UserModel = require('./UserModel.js');
var CartItem = require('./CartItem.js');

var formUpload = multer({ dest: './temp' });
var app = express();

router.get('/', (req, res, next) => {
  res.send('Called Users');
});

//  INSERT USER
router.post('/insertUser', (req, res, next) => {

  // To know which call was made
  console.log("# POST: Insert User");

  var connector = new MongoConnector((err) => {
    UserModel.insertUser(connector, req.body, (err, mongoRes) => {
        console.log(mongoRes.result);
        connector.close();

        res.setHeader('Content-Type', 'application/json');
        res.status(201).send(JSON.stringify({response: "USER_INSERTED"}));
    });
  });
});

/**
 *   Get all users from the database
 */
router.get('/getUsers', (req, res, next) => {
  // To know which call was made
  console.log("# GET: Getting All Users");

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
  // To know which call was made
  console.log("# POST: Getting User");

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
  // To know which call was made
  console.log("# PUT: Edit Profile");

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
  // To know which call was made
  console.log("# PUT: Deactivate User");

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
  // To know which call was made
  console.log("# PUT: Activate User");

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
  // To know which call was made
  console.log("# POST: Login User");
  console.log("  > Logged as: " + req.body.email);

  var email = req.body.email;
  var password = req.body.password;

  if(email && password) {
    var connector = new MongoConnector((err) => {

      UserModel.loginUser(connector, email, password, (result) => {
          connector.close();
          if(result === "NOT_FOUND") {
            res.setHeader('Content-Type', 'application/json');
            res.status(418).send(JSON.stringify({response: {
                                                  "status": "incorrect",
                                                  "type": "null"}}));
            console.log("  > INCORRECT");
          }
          else {
            res.setHeader('Content-Type', 'application/json');
            res.status(200).send(JSON.stringify({response: {
                                                    "status": "correct",
                                                    "type": result.type}}));
            console.log("  > CORRECT");
          }
      });

    });
  }
  else {
    res.setHeader('Content-Type', 'application/json');
    res.status(422).send(JSON.stringify({response: "Missing the email or password"}));
  }
});


// ADD TO CART
router.post('/addCart', (req, res, next) => {
  // To know which call was made0
  console.log("# POST: Add to Cart");

  var email = req.body.email;
  var product = req.body.product;
  var qty = req.body.qty;
  var price = req.body.price;

  if(email && product && qty && price) {
                                                                                              /******** TODO *********/
    // var checkConnecton = new MongoConnector((err) => {
    //   CartItem.item_exist(connector, product, (err, mongoRes) => {
    //
    //   });
    // });

    var connector = new MongoConnector((err) => {
      CartItem.add_to_cart(connector, req.body, (err, mongoRes) => {
        console.log(mongoRes);
        connector.close();

        res.setHeader('Content-Type', 'application/json');
        res.status(201).send(JSON.stringify({response: "ADDED_TO_CART"}));
      });
    });
  }
  else {
    res.setHeader('Content-Type', 'application/json');
    res.status(422).send(JSON.stringify({response: "MISSING_INFORMATION"}));
  }
});

// RESET CART
router.put('/resetCart', (req, res, next) => {
  // To know which call was made
  console.log("# PUT: Reset Cart");
  var email = req.body.email;

  if(email) {
    var connector = new MongoConnector((err) => {
      CartItem.reset_cart(connector, email, (err, mongoRes) => {
        console.log(mongoRes);
        connector.close();

        res.setHeader('Content-Type', 'application/json');
        res.status(201).send(JSON.stringify({response: "CART_RESET_COMPLETED"}));
      });
    });
  }
  else {
    res.setHeader('Content-Type', 'application/json');
    res.status(422).send(JSON.stringify({response: "MISSING_INFORMATION"}));
  }
});

/**
 *   Get all the elements of the cart
 */
router.post('/getCart', (req, res, next) => {
  // To know which call was made
  console.log("# POST: Getting Cart");

  var connector = new MongoConnector((err) => {
    var email = req.body.email;
    console.log(req.body.email);

    if(email) {
      CartItem.getCart(connector, email, (docs) => {
          connector.close();

          // Element not found
          if(docs === "NOT_FOUND") {
            res.setHeader('Content-Type', 'application/json');
            res.status(404).send(JSON.stringify({response: "NOT_FOUND"}));
          }
          else {
            res.setHeader('Content-Type', 'application/json');
            res.status(200).send(JSON.stringify({response: docs.cart}));
          }
      });
    }
    else {
      res.setHeader('Content-Type', 'application/json');
      res.status(422).send(JSON.stringify({response: "Missing the email Parameter"}));
    }
  });
});

/**
 *   Remove element from the cart
 */
router.put('/removeCartElement', (req, res, next) => {
  // To know which call was made
  console.log("# PUT: Removing Cart Element");

  var connector = new MongoConnector((err) => {
    var email = req.body.email;
    var product_name = req.body.product_name;

    console.log(req.body.email);

    if(email && product_name) {
      var connector = new MongoConnector((err) => {
        CartItem.remove_cart_element(connector, email, product_name, (err, mongoRes) => {
          console.log(mongoRes);
          connector.close();

          res.setHeader('Content-Type', 'application/json');
          res.status(201).send(JSON.stringify({response: "REMOVED_ELEMENT"}));
        });
      });
    }
    else {
      res.setHeader('Content-Type', 'application/json');
      res.status(422).send(JSON.stringify({response: "MISSING_INFORMATION"}));
    }
  });
});

module.exports = router;
