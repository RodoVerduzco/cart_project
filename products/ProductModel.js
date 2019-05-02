/**
 *  Users Handler
 *
 */

/* jshint esversion: 6 */

const COLLECTION = 'products';

class ProductModel {

  constructor(data) {
    this.id = data._id;
    this.name = data.name;
    this.description = data.description;
    this.type = data.type;
    this.price = data.price;
    this.qty = data.qty;
  }

  /**
   * inserts a new user
   *  @param {object} connector - mongodb connection
   *  @param {JSON object} productModel - data to write
   *  @param {function} callback - function to call
   */
  static insertProduct(connector, productModel, callback) {

    var data = {
      "name": productModel.name,
      "description": productModel.description,
      "type": productModel.type,
      "price": productModel.price,
      "qty": productModel.qty,
      "status": "active"
    };

    connector.insertDocInCollection(COLLECTION, data, callback);
  }

  /**
   *  Updates the user information
   *  @param {object} connector - mongodb connection
   *  @param id - user to modify
   *  @param productModel - data to write
   *  @param callback - function to call
   */
  static updateProduct(connector, id, productModel, callback) {

  }

  /**
   *  Gets the product  information
   *  @param {object} connector - mongodb connection
   *  @param product_name - product to retrieve the data for
   *  @param callback - function to call each time a record is found
   */
  static getProduct(connector, product_name, callback) {
    var condition = {
      "name": product_name
    };

    connector.getDocsFromCollection(COLLECTION, condition, callback);
  }

  /**
   *  Receives a list of products in the database from  specific condition
   *  @param {object} connector - mongodb connection
   *  @param {JSON} condition - find condition
   *  @param callback - function to call each time a record is found
   */
  static getProducts(connector, condition, callback) {
    connector.getDocsFromCollection(COLLECTION, condition, callback);
  }

  /**
   *  Receives the information from all the products
   */
  static getAllProducts(connector, callback) {
    connector.getAllDocs(COLLECTION, callback);
  }

  static changeProductStatus(connector, product_name, callback) {
    var myQuery = {"name": product_name};
    var update_cond = {$bit: {status: {xor: 1}}};  //Xor to change true or false

    connector.updateDoc(COLLECTION, myQuery, update_cond, callback);
  }

  static editProduct(connector, product_name, new_data, callback) {
    var myQuery = { "name": product_name };
    var update_cond = { $set: new_data };

    connector.updateDoc(COLLECTION, myQuery, update_cond, callback);
  }

}

module.exports = ProductModel;
