var mongoUtil = require('../mongoUtil');

exports.createComment = function(comment, callback) 
{
	var dbContext = mongoUtil.getDBContext();
	var collection = dbContext.collection('comments');
	collection.insertOne(
		comment, 
		function(err, result) {
			callback(err, result);
	});
}
exports.getComments = function({ pageSize=10, pageNum=1, entityID, parentCommentID } = {}, callback) {
	var dbContext = mongoUtil.getDBContext();
	var collection = dbContext.collection('comments');
	var query = {};
	query.entityID = entityID;
	query.parentCommentID = parentCommentID;
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
exports.deleteComment = function({ entityID, commentID } = {}, callback) {
	var dbContext = mongoUtil.getDBContext();
	var collection = dbContext.collection('comments');
	var query = {};
	query.entityID = entityID;
	query._id = new mongoUtil.getObjectID(commentID);
	collection.deleteOne(query, function(err, result) {
		if(err) {
			console.log(err);
			callback(err);
		}
		else {
			callback(err, result);
		}
	});
	

}