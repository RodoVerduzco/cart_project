/**
 *  Product Handler
 *
 */

/* jshint esversion: 6 */
var multer = require('multer');    // To save Files
var express = require('express');
var router = express.Router();

var MongoConnector = require('../MongoConnector.js');
var ProductModel = require('./ProductModel.js');

var formUpload = multer({ dest: './temp' });
var app = express();

router.get('/', (req, res, next) => {
  res.send('Called Products');
});

//  INSERT USER
router.post('/insertProduct', (req, res, next) => {

  // To know which call was made
  console.log("# POST: Insert Products");
  var connector = new MongoConnector((err) => {
    ProductModel.insertProduct(connector, req.body, (err, mongoRes) => {
        console.log(mongoRes.result);
        connector.close();

        res.setHeader('Content-Type', 'application/json');
        res.status(201).send(JSON.stringify({response: "PRODUCT_INSERTED"}));
    });
  });
});


/**
 *   Get all users from the database
 */
router.get('/getProducts', (req, res, next) => {
  // To know which call was made
  console.log("# GET: Getting All Products");

  var connector = new MongoConnector((err) => {
    var users_ = ProductModel.getAllProducts(connector, (docs) => {
      connector.close();
      res.setHeader('Content-Type', 'application/json');
      res.status(200).send(JSON.stringify({response: docs}));
    });
  });
});

/**
 *  Get a specific Product form the database
 */
router.post('/getProduct', (req, res, next) => {
  // To know which call was made
  console.log("# POST: Getting Specific Product");

  var connector = new MongoConnector((err) => {
    var name = req.body.name;
    console.log(req.body.name);

    if(name) {
      ProductModel.getProduct(connector, name, (docs) => {
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
      res.status(422).send(JSON.stringify({response: "Missing the name Parameter"}));
    }
  });
});

// EDIT PRODUCT INFORMATION
router.put('/editProduct', (req, res, next) => {
  // To know which call was made
  console.log("# PUT: Edit Product Information");

  var name = req.body.name;

  // If values needed are received
  if(name) {
    var connector = new MongoConnector((err) => {

      ProductModel.editProduct(connector, name, req.body, (docs) => {
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

// ACTIVATES OR DEACTIVATES PRODUCT STATUS
router.put('/changeProductStatus', (req, res, next) => {
  // To know which call was made
  console.log("# PUT: Change Product Status");

  var product_name = req.body.name;

  // If values needed are received
  if(product_name) {
    var connector = new MongoConnector((err) => {

      ProductModel.changeProductStatus(connector, product_name, (result) => {
          console.log(result);
          connector.close();

          res.setHeader('Content-Type', 'application/json');
          res.status(200).send(JSON.stringify({response: "Product Status Changed"}));
      });
    });
  }
  else {
    res.setHeader('Content-Type', 'application/json');
    res.status(422).send(JSON.stringify({response: "Missing the name Parameter"}));
  }
});


// UPDATE INVENTORY
router.post('/updateInverntory', (req, res, next) => {
  // To know which call was made
  console.log("# POST: Update Inventory Product");

  var name = req.body.name;
  var qty = parseInt(req.body.qty);

  if(name && qty) {
    // find the product
    var connector = new MongoConnector((err) => {
        ProductModel.getProduct(connector, name, (docs) => {
            connector.close();

            // Element not found
            if(docs === "NOT_FOUND") {
              res.setHeader('Content-Type', 'application/json');
              res.status(404).send(JSON.stringify({response: "NOT_FOUND"}));
            }
            else {
              // Update the Product
              var connectorUpdate = new MongoConnector((err) => {
                var old_qty = parseInt(docs.qty);
                var new_qty = old_qty + qty;

                if(new_qty<0) {
                  res.setHeader('Content-Type', 'application/json');
                  res.status(422).send(JSON.stringify({response: {
                                                        "status": "failed",
                                                        "information": "Negative number not allowed"
                                                      }}));
                }
                else {
                  // Update the database
                  ProductModel.editProduct(connectorUpdate, name, {"qty": new_qty}, (result) => {
                    connectorUpdate.close();

                    if(result === "NOT_FOUND") {
                      res.setHeader('Content-Type', 'application/json');
                      res.status(418).send(JSON.stringify({response: "Incorrect Product or Password"}));
                    }
                    else {
                      res.setHeader('Content-Type', 'application/json');
                      res.status(200).send(JSON.stringify({response: result}));
                    }
                  });
                }
              });
            }
        });
    });
  }
  else {
    res.setHeader('Content-Type', 'application/json');
    res.status(422).send(JSON.stringify({response: "Missing the name or the qty of the product"}));
  }
});

module.exports = router;
