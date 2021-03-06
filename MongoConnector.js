/* jshint esversion: 6 */
// index.js

const MongoClient = require('mongodb').MongoClient;

var dbName = "shoppingCart";

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
   *  Receive the elements from the collection
   */
  getDocsFromCollection(col, where, callback) {

    var data = this.client.db(dbName).collection(col).findOne(where, (err, doc) =>{

      // Found
      if(doc) {
        callback(doc);
      }
      else {
        callback("NOT_FOUND");
      }
    });
  }

  /**
   *  Receive the specific elements from the collection
   */
  getDocsFromCollectionProjection(col, where, projection, callback) {

    var data = this.client.db(dbName).collection(col).find(where, (err, doc) =>{
      var projected = doc.project(projection);
      projected.forEach((element)=>{
        callback(element);
      });
    });
  }

  /**
   *  Delete a specific element from collection
   */
  deleteDocsFromCollectionProjection(col, where, projection, callback) {

    var data = this.client.db(dbName).collection(col).updateOne(where, projection, (err, doc) => {
      if (err) throw err;
      console.log(doc);
      callback(doc);
    });
  }

  /**
   *  Get all users from the collection
   */
   getAllDocs(col, callback) {

     this.client.db(dbName).collection(col).find({}).toArray(
      (err, result) => {
        if (err) throw err;
        callback(result);
      });
   }

   /**
    *  Update a single element collection
    */
    updateDoc(col, myQuery, update_cond, callback) {
      this.client.db(dbName).collection(col).updateOne(myQuery, update_cond,
       (err, result) => {
         if (err) throw err;
         callback({
          "status": "UPDATED",
          "query": myQuery,
          "condition": update_cond
         });
       });
    }

    /**
     *  Adds a value to the selected element
     */
    aggregateDoc(col, myQuery, addQuery, callback) {
      this.client.db(dbName).collection(col).aggregate(myQuery, update_cond,
       (err, result) => {
         if (err) throw err;
         callback({
          "status": "AGGREGATED",
          "query": myQuery,
          "condition": update_cond
         });
       });
    }

  close() {
    this.client.close();
  }
}

module.exports = MongoConnector;
