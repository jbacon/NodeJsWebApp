var mongodb = require('mongodb')
var dbContext;

exports.connectDB = function (url) {
  console.log("Connecting MongoDB...");
  if(dbContext) {
    console.log("Connection to MongoDB already exists...");
  }
  else {
    mongodb.MongoClient.connect(
        url,
        (error, db) => {
          if(error) {
            console.log("Connection to MongoDB failed...");
            throw error
          }
          else  {
            dbContext = db;
            console.log("Connection to MongoDB success...");
          }
        }
      );
  }
}
exports.closeDB = function(callback) {
  dbContext.close(function(err, result) {
    callback(err, result);
  })
}
exports.getDB = function() {
  if(dbContext) {
    return dbContext
  }
  else {
    throw new Error('Database context does not exist.')
  }
}