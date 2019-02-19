/**
 *  Users Handler
 *
 */

/* jshint esversion: 6 */

const COLLECTION = 'products';

class ProductModel {

  constructor(data) {
    this.id = data._id;
    this.product_name = data.product_name;
    this.price = data.price;
    this.inventory = data.inventory;
  }

  /**
   * inserts a new user
   *  @param {object} connector - mongodb connection
   *  @param {JSON object} productModel - data to write
   *  @param {function} callback - function to call
   */
  static insertProduct(connector, productModel, callback) {

    var data = {
      "product_name": productModel.product_name,
      "price": productModel.price,
      "inventory": productModel.inventory,
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
      "product_name": product_name
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

  static editProduct(connector, product_name, new_data, callback) {
    var myQuery = {"product_name": product_name};
    var update_cond = { $set: new_data};

    connector.updateDoc(COLLECTION, myQuery, update_cond, callback);
  }

}

module.exports = ProductModel;
