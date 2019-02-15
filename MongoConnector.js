/* jshint esversion: 6 */
// index.js

const MongoClient = require('mongodb').MongoClient;

var dbName = "shopDatabase";

class MongoConnector {

  constructor(callback) {
    this.url = "mongodb://127.0.0.1:27017";
    this.conn = new MongoClient(this.url, { useNewUrlParser: true });
    this.connectionAvailable = false;
    this.client = null;
    this.conn.connect( (err, client) => {
      this.connectionAvailable = true;
      this.client = client;
      callback(err);
    });
  }

  get_user(username, callback) {
    var i = 0;
    this.client.db(dbName).collection('users').find({'username': username}).forEach(
      (err, doc) => {
        if (i==0) {
          this.client.close();
          callback(doc);
        }
        i++;

      });
  }

/**
 *  Insert New element to the collection
 */
  insertDocInCollection(col, fields, callback) {
      this.client.db(dbName).collection(col).insertOne(fields, callback);
  }

/**
 * { $set: }
 */
  updateDocIncollection(col, fields, where, callback) {
    this.client.db(dbName).collection(col).updateOne(where, fields, callback);
  }


  /**
   *  Receive the specific elements from the collection
   */
  getDocsFromCollection(col, where, callback) {
    this.client.db(dbName).collection(col).find(where).forEach(
      (err, doc) => {
        callback(doc);
      }
    );
  }

  close() {
    this.client.close();
  }
}

module.exports = MongoConnector;
