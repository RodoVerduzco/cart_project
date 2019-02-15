/* jshint esversion: 6 */

var MongoConnector = require('./MongoConnector.js');
var UserModel = require('./users/UserModel.js');

var user = {
  "username" : "jenkins",
  "password" : "password",
  "email" : "jenkinswonnwn@gmail.com"
};

var connector = new MongoConnector((err) => {

  UserModel.insertUser(connector, user, (err, res) => {
      console.log(res.result);
      connector.close();
  });
});
