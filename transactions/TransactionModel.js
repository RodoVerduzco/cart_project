/**
 *  Users Handler
 *
 */

/* jshint esversion: 6 */

const COLLECTION = 'users';

class TransactionModel {

  // Constructor
  constructor(data) {
    this.product_list   = data.product_list;
    this.subtotal       = data.subtotal;
    this.payment_method = data.payment_method;
    this.status         = data.status;
  }

  /**
   *  Adds element to user cart
   *  @param {object} connector - mongodb connection
   *  @param {string} email - User email to add transaction to
   *  @param transactionModel - data to write containing the transaction info
   *  @param callback - function to call
   */
  static insertTransaction(connector, email, transactionModel, callback) {
    var myQuery = {
      "email": email
    };

    var transaction = {
      $push: {
        "transactions": {
          "product_list": transactionModel.product_list,
          "subtotal": transactionModel.subtotal,
          "payment_method": transactionModel.payment_method,
          "status": transactionModel.status,
          "date": new Date()
        }
      }
    };

    connector.updateDoc(COLLECTION, myQuery, transaction, callback);
  }

  /**
   *  Updates the user information
   *  @param {object} connector - mongodb connection
   *  @param email - user to retrieve the data for
   *  @param callback - function to call each time a record is found
   */
  static getTransactionsUser(connector, email, callback) {
    var condition = {
      "email": email
    };

    connector.getDocsFromCollection(COLLECTION, condition, callback);
  }

  /**
   *  Updates the user information
   *  @param {object} connector - mongodb connection
   *  @param email - user to retrieve the data for
   *  @param date - date used as id
   *  @param callback - function to call each time a record is found
   */
  static getTransactionUser(connector, email, date, callback) {
    var condition = {
      "email": email
    };

    var projection = {"transactions": {$elemMatch: {"date": new Date(date)}}};

    connector.getDocsFromCollectionProjection(COLLECTION, condition, projection, callback);
  }

  static editTransactions(connector, email, new_data, callback) {
    var myQuery = {"email": email};
    var update_cond = { $set: {transactions: new_data}};

    connector.updateDoc(COLLECTION, myQuery, update_cond, callback);
  }

}

module.exports = TransactionModel;
