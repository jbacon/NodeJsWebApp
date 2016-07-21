

var mongoClient = require('mongodb').MongoClient;

var dbContext;

exports.connectDB = function (url, done) {
  console.log("Attempting to connect to MongoDB...");
  mongoClient.connect(url, function(err, db) {
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
exports.closeDB = function() {
  if(dbContext) {
    dbContext.close(function(err, result) {
      dbContext = null;
      done(err);
    })
  }
}
