/* jshint esversion: 6 */

var MongoConnector = require('./MongoConnector.js');

var ProductModel = require('./products/ProductModel.js');

var user = {
  "username" : "jenkins",
  "password" : "password",
  "email" : "jenkins@gmail.com"
};

var new_data = {
  "username" : "jenkins",
  "password" : "password1",
  "email" : "jenkins@gmail.com"
};


var email = "jenkins@gmail.com";
var password = "password1";


var product = {
  "product_name" : "Apple iPhone Xs Max",
  "price" : "25000",
  "inventory" : 15
};

var product_to_search = "Google Pixel 2 xl";


/**
 **       PRODUCTS     **
 **/


// INSERT PRRODUCT
// var connector = new MongoConnector((err) => {
//
//   ProductModel.insertProduct(connector, product, (err, res) => {
//       console.log(res.result);
//       connector.close();
//   });
// });


// GET SPECIFIC PRODUCT
// var connector = new MongoConnector((err) => {
//
//   ProductModel.getProduct(connector, product_to_search, (res) => {
//       console.log(res);
//       connector.close();
//   });
// });

//  GET PRODUCTS
// var connector = new MongoConnector((err) => {
//
//   ProductModel.getAllProducts(connector, (res) => {
//       console.log(res);
//       //console.log(res.result);
//       connector.close();
//   });
// });

// DEACTIVATE PRODUCT
// var connector = new MongoConnector((err) => {
//   ProductModel.editProduct(connector, product_to_search, {"status": "Inactive"}, (res) => {
//       console.log(res);
//       connector.close();
//   });
// });

// ACTIVATE
// var connector = new MongoConnector((err) => {
//   ProductModel.editProduct(connector, "Apple iPhone Xs Max", {"status": "Active"}, (res) => {
//       console.log(res);
//       connector.close();
//   });
// });

// UPDATE INVENTORY
// var connector = new MongoConnector((err) => {
//   ProductModel.editProduct(connector, "Apple iPhone Xs Max", {"status": "Active"}, (res) => {
//       console.log(res);
//       connector.close();
//   });
// });
