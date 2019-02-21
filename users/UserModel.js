/**
 *  Users Handler
 *
 */

/* jshint esversion: 6 */

const COLLECTION = 'users';

class UserModel {

  constructor(data) {
    this.id = data._id;
    this.username = data.username;
    this.email = data.email;
  }

  /**
   * inserts a new user
   *  @param {object} connector - mongodb connection
   *  @param {JSON object} userModel - data to write
   *  @param {function} callback - function to call
   */
  static insertUser(connector, userModel, callback) {

    var data = {
      "username": userModel.username,
      "password": userModel.password,
      "email": userModel.email,
      "status": "active",
      "type": "admin",
      "cart": []
    };

    connector.insertDocInCollection(COLLECTION, data, callback);
  }

  /**
   *  Updates the user information
   *  @param {object} connector - mongodb connection
   *  @param id - user to retrieve the data for
   *  @param callback - function to call each time a record is found
   */
  static getUser(connector, email, callback) {
    var condition = {
      "email": email
    };

    connector.getDocsFromCollection(COLLECTION, condition, callback);
  }

  /**
   *  Updates the user information
   *  @param {object} connector - mongodb connection
   *  @param {JSON} condition - find condition
   *  @param callback - function to call each time a record is found
   */
  static getUsers(connector, condition, callback) {
    connector.getDocsFromCollection(COLLECTION, condition, callback);
  }

  /**
   *  Receives the information from all the userss
   */
  static getAllUsers(connector, callback) {
    connector.getAllDocs(COLLECTION, callback);
  }

  static editUser(connector, email, new_data, callback) {
    var myQuery = {"email": email};
    var update_cond = { $set: new_data};

    connector.updateDoc(COLLECTION, myQuery, update_cond, callback);
  }

  static changeUserStatus(connector, email, callback) {
    var myQuery = {"email": email};
    var update_cond = {$bit: {status: {xor: 1}}};  //Xor to change true or false

    connector.updateDoc(COLLECTION, myQuery, update_cond, callback);
  }

  static loginUser(connector, email, password, callback) {
    var myQuery = { $and: [
      {"email": email},
      {"password": password}
    ]};

    connector.getDocsFromCollection(COLLECTION, myQuery, callback);
  }
}

module.exports = UserModel;
