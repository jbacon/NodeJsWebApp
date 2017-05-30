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
    if(err) {
      callback(err)
    }
    else {
      callback(err, result);
    }
  })
}
exports.createDocument = function({ collection, document } = {}, callback) {
  var collection = dbContext.collection(collection);
  collection.insertOne(
    document, 
    function(err, result) {
      callback(err, result);
    });
}
exports.deleteDocument = function({ collection, documentID } = {}, callback) {
  var collection = dbContext.collection(collection);
  collection.deleteOne({ _id: documentID }, function(err, result) {
    if(err) {
      callback(err);
    }
    else {
      callback(err, result);
    }
  });
}
exports.updateDocument = function({ collection, document } = {}, callback) {
  var collection = dbContext.collection(collection);
  collection.updateOne(document, function(err, result) {
    if(err) {
      console.log(err);
      callback(err);
    }
    else {
      callback(err, result);
    }
  });
}
exports.getDocumentsPaginated = function({ collection, query, pageSize=10, pageNum=1 } = {}, callback) {
  var collection = dbContext.collection(collection);
  var cursor = collection.find(query);
  if(pageSize && pageNum) {
    cursor.skip(parseInt(pageSize) * (parseInt(pageNum) - 1));
    cursor.limit(parseInt(pageSize));
  }
  else if(pageSize) {
    cursor.limit(parseInt(pageSize));
  }
  cursor.toArray(function(err, docs) {
    callback(err, docs);
  });
}
exports.getDocumentsBatched = function({ collection, query, batchSize=1 } = {}, callback) {
  var collection = dbContext.collection(collection);
  var cursor = collection.find(query);
  var cursor = cursor.batchSize(batchSize);
  cursor.forEach(
    function(docs) {
      callback(undefined, docs);
    },
    function(err) {
      callback(err, undefined);
    
    }
  );
}
