/**
 *  Transaction Handler
 *
 */

/* jshint esversion: 6 */
var multer = require('multer');    // To save Files
var express = require('express');
var router = express.Router();

var MongoConnector = require('../MongoConnector.js');
var TransactionModel = require('./TransactionModel.js');
var CartItem = require('../users/CartItem.js');
var ProductModel = require('../products/ProductModel.js');


var app = express();


router.get('/', (req, res, next) => {
  res.send('Called Transactions');
});

/**
 *  Get a specific User form the database
 */
router.post('/getTransactions', (req, res, next) => {
  // To know which call was made
  console.log("# POST: Getting User Transactions");

    var email = req.body.email;
    console.log("  > " + req.body.email);

    if(email) {
      var connector = new MongoConnector((err) => {
        TransactionModel.getTransactionsUser(connector, email, (docs) => {
            connector.close();

            // Element not found
            if(docs === "NOT_FOUND") {
              res.setHeader('Content-Type', 'application/json');
              res.status(404).send(JSON.stringify({response: "NO_TRANSACIONS_FOR_THAT_USER"}));
            }
            else {
              res.setHeader('Content-Type', 'application/json');
              res.status(200).send(JSON.stringify({response: docs.transactions}));
            }
        });
      });
    }
    else {
      res.setHeader('Content-Type', 'application/json');
      res.status(422).send(JSON.stringify({response: "Missing the email Parameter"}));
    }
});

/**
 *  Get a specific transaction from a user
 */
router.post('/findTransaction', (req, res, next) => {
  // To know which call was made
  console.log("# POST: Getting Specific User Transactions");

    var email = req.body.email;
    var transaction_date = req.body.transaction_date;
    console.log("  > " + email);
    console.log("  > " + transaction_date);

    if(email && transaction_date) {
      var connector = new MongoConnector((err) => {
        TransactionModel.getTransactionUser(connector, email, transaction_date, (docs) => {
            connector.close();

            // Element not found
            if(Object.keys(docs).length) {
              res.setHeader('Content-Type', 'application/json');
              res.status(404).send(JSON.stringify({response: "NO_TRANSACIONS_IN_DATE"}));
            }
            else {
              res.setHeader('Content-Type', 'application/json');
              res.status(200).send(JSON.stringify({response: docs.transactions}));
            }
        });
      });
    }
    else {
      res.setHeader('Content-Type', 'application/json');
      res.status(422).send(JSON.stringify({response: "Missing the email or date Parameter"}));
    }
});

/**
 *  Delete a specific transaction
 */
router.delete('/deleteTransaction', (req, res, next) => {
  // To know which call was made
  console.log("# DELETE: Delete specific Transactions");

    var email = req.body.email;
    var transaction_date = req.body.transaction_date;
    console.log("  > " + email);
    console.log("  > " + transaction_date);

    if(email && transaction_date) {
      var connector = new MongoConnector((err) => {
        TransactionModel.getTransactionsUser(connector, email,(docs) => {
            connector.close();

            // Element not found
            if(docs === "NOT_FOUND") {
              res.setHeader('Content-Type', 'application/json');
              res.status(404).send(JSON.stringify({response: "NO_TRANSACIONS_IN_DATE"}));
            }
            else {
              for(var i=0; i<docs.transactions.length; i++){
                if(docs.transactions[i].date.toISOString() == transaction_date) {
                  docs.transactions.splice(i, 1);
                }
              }

              var connectorDelete = new MongoConnector((err) => {

                TransactionModel.editTransactions(connectorDelete, email, docs.transactions, (docs) => {
                  connectorDelete.close();

                  res.setHeader('Content-Type', 'application/json');
                  res.status(201).send(JSON.stringify({response: "TRANSACTION_DELETED"}));
                });
              });
            }
        });
      });
    }
    else {
      res.setHeader('Content-Type', 'application/json');
      res.status(422).send(JSON.stringify({response: "Missing the email or date Parameter"}));
    }
});



/**
 *   Perform the Checkout for the cart
 */
router.post('/checkout', (req, res, next) => {
  // To know which call was made
  console.log("# POST: Checkout");

  var completed = false;
  var email = req.body.email;

  if (email) {

    var connectorCart = new MongoConnector((err) => {
      CartItem.getCart(connectorCart, email, (cart_docs) => {
          connectorCart.close();

          // Cart Element not found
          if(cart_docs === "NOT_FOUND" || cart_docs.cart.length == 0) {
            res.setHeader('Content-Type', 'application/json');
            res.status(404).send(JSON.stringify({response: {
                                                  "status": "failed",
                                                  "information": "Cart is Empty"
                                                }}));
          }
          else {
            var checkout_cart = {};
            var cart = cart_docs.cart;
            var subtotal = 0;

            // Prepare the subtotal
            cart.forEach((element) =>{
                subtotal += element.qty * element.price;
            });

            // Prepare checkout cart
            checkout_cart.subtotal = subtotal;
            checkout_cart.payment_method = req.body.payment_method;
            checkout_cart.status = req.body.status;
            checkout_cart.product_list = cart;

            // Insert the transaction
            var connector = new MongoConnector((err) => {
              TransactionModel.insertTransaction(connector, email, checkout_cart, (mongoRes) => {

                if(mongoRes.status === "UPDATED") {
                  var transactions = mongoRes.condition.$push.transactions.product_list;

                  // Show the Information
                  console.log(" > SHOW TRANSACTIONS");
                  console.log(transactions);
                  console.log("\n");

                  // Remove Items from Inventory
                  transactions.forEach( function (element) {
                    var name = element.product_name;
                    var add_qty  = - parseInt(element.qty);


                    // find the product
                    var connectorFind = new MongoConnector((err) => {
                      ProductModel.getProduct(connectorFind, name, (docs) => {
                        connectorFind.close();
                        // Update the Product
                        var connectorUpdate = new MongoConnector((err) => {
                          var old_qty = parseInt(docs.qty);
                          var new_qty = old_qty + add_qty;

                          // Check product is on inventory
                          if(new_qty < 0) {
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
                                res.status(418).send(JSON.stringify({response: "Incorrect Product"}));
                              }
                              else {
                                console.log("  > ITEM INVENTORY UPDATED");

                                if(!completed){
                                  res.setHeader('Content-Type', 'application/json');
                                  res.status(201).send(JSON.stringify({response: {
                                    "status": "COMPLETED",
                                    "information": "Transaction made Successfuly"}}));
                                  }

                                  completed = true;
                              }
                            }); // edit product
                          } //else (neg qty)
                        }); // Mongo connector
                      }); // get product
                    }); // Mongo Connector
                  });


                  // Reset the cart
                  connector = new MongoConnector((err) => {
                    CartItem.reset_cart(connector, email, (mongoRes) => {
                      if(mongoRes.status === "UPDATED")
                      console.log("  > Cart is Empty");
                    });
                  });

                }
              });
            });
          }
      });
    });

  }
  else {
    res.setHeader('Content-Type', 'application/json');
    res.status(422).send(JSON.stringify({response: "Missing the email Parameter"}));
  }
});


module.exports = router;
