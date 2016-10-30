var mongoUtil = require('../mongoUtil');

exports.createComment = function(comment, callback) 
{
	var commentCollection = mongoUtil.getDBContext().collection('comments');
	commentCollection.insertOne(comment, function(err, result) {
		callback(err, result);
	});
}
exports.getComments = function({ pageSize=10, pageNum=1, entityID, parentCommentID } = {}, callback) {
	var dbContext = mongoUtil.getDBContext();
	var collection = dbContext.collection('comments');
	var query = {};
	query.entityID = entityID;
	query.parentCommentID = parentCommentID;
	console.log();
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