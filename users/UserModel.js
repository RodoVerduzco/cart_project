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
    // insertDocInCollection(col, fields, callback) {
    var data = {
      "username": userModel.username,
      "password": userModel.password,
      "email": userModel.email
    };

    connector.insertDocInCollection(COLLECTION, data, callback);
  }

  /**
   *  Updates the user information
   *  @param {object} connector - mongodb connection
   *  @param id - user to modify
   *  @param userModel - data to write
   *  @param callback - function to call
   */
  static updateUser(connector, id, userModel, callback) {

  }

  /**
   *  Updates the user information
   *  @param {object} connector - mongodb connection
   *  @param id - user to retrieve the data for
   *  @param callback - function to call each time a record is found
   */
  static getUser(connector, id, callback) {

  }

  /**
   *  Updates the user information
   *  @param {object} connector - mongodb connection
   *  @param userModel - data for where clause
   *  @param callback - function to call each time a record is found
   */
  static getUsers(connector, userModel, callback) {

  }
}

module.exports = UserModel;
