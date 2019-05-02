/**
 *  Users Handler
 *
 */

/* jshint esversion: 6 */

const COLLECTION = 'users';

class CartItem {

  // Constructor
  constructor(data) {
    this.product_name = data.product;
    this.qty = data.qty;
    this.email = data.email;
    this.description = data.description;
  }

  /**
   *  Adds element to user cart
   *  @param {object} connector - mongodb connection
   *  @param cartItem - data to write
   *  @param callback - function to call
   */
  static add_to_cart(connector, cartItem, callback) {
    var myQuery = {
      "email": cartItem.email
    };

    var item_to_cart = {
      $push: {
        "cart": {
          "product_name": cartItem.product,
          "qty": cartItem.qty,
          "price": cartItem.price,
          "description": cartItem.description
        }
      }
    };

    connector.updateDoc(COLLECTION, myQuery, item_to_cart, callback);
  }

  /**
   *
   *  @param {object} connector - mongodb connection
   *  @param - data to write
   *  @param callback - function to call
   */
  static updateCart(connector, email, new_data, callback) {
    var myQuery = {
      "email": email
    };

    var newCartQuery = { $set: {'cart': new_data}};

    connector.updateDoc(COLLECTION, myQuery, newCartQuery, callback);
  }

  static get_cart_item(connector, email, product, callback) {
    var myQuery = {$and: [
      {"email": email},
      {"cart": { "product_name": product}}
    ]};
    console.log(myQuery);
    connector.getDocsFromCollection(COLLECTION, myQuery, callback);
  }

  /**
   *  Adds element to user cart
   *  @param {object} connector - mongodb connection
   *  @param userModel - data to write
   *  @param callback - function to call
   */
  static reset_cart(connector, email, callback) {
    var myQuery = {
      "email": email
    };

    var resetQuery =  {$set: { "cart": []}};

    connector.updateDoc(COLLECTION, myQuery, resetQuery, callback);
  }

  /**
   *  Gets all the elements from the cart
   *  @param {object} connector - mongodb connection
   *  @param {String} email - email of the user
   *  @param callback - function to call each time a record is found
   */
  static getCart(connector, email, callback) {
    var condition = {
     "email": email
   };

    connector.getDocsFromCollection(COLLECTION, condition, callback);
  }

  /**
   *  Remove element from user cart
   *  @param {object} connector    - mongodb connection
   *  @param {string} email        - User email
   *  @param {string} product_name - Name of the product to delete
   *  @param {callback} callback   - function to call
   */
  static remove_cart_element(connector, email, product_name, callback) {
    var myQuery = {
      "email": email
    };

    var condition =  {
      $pull: {
        "cart": {
          "product_name": product_name
        }
      }
    };

    connector.updateDoc(COLLECTION, myQuery, condition, callback);
  }

}

module.exports = CartItem;
