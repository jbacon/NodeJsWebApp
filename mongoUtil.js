var MongoClient = require('mongodb').MongoClient;
var ObjectID = require('mongodb').ObjectID;

var dbContext;

exports.connectDB = function (url, done) {
  console.log("Attempting to connect to MongoDB...");
  MongoClient.connect(url, function(err, db) {
    console.log("Attempted to connect to MongoDB");
    if(err) 
      done(err);
    else {
      dbContext = db;
      done();
    }
  })
}
exports.getDBContext = function() {
  return dbContext;
}
exports.getObjectID = function() {
  return ObjectID;
}
exports.closeDB = function() {
  if(dbContext) {
    dbContext.close(function(err, result) {
      dbContext = null;
      done(err);
    })
  }
}
