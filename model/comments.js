var mongoUtil = require('../mongoUtil');

exports.createComment = function(params, callback) 
{
	var comment = {};
	if(params.entityID != undefined) 
		comment.entityID = params.entityID;
	if (params.parentCommentID != undefined) 
		comment.parentCommentID = params.parentCommentID;
	if(params.commentText != undefined) 
		comment.commentText = params.commentText;
	if(params.commenterName != undefined)
		comment.commenterName = params.commenterName
	/*if(params.subscriberID != undefined) 
		comment.subscriberID = params.subscriberID;*/

	var commentCollection = mongoUtil.getDBContext().collection('comments');
	commentCollection.insert(comment, function(result, err) {
		callback(err, result);
	});
}
exports.getComments = function(callback) {
	var dbContext = mongoUtil.getDBContext();
	var collection = dbContext.collection('comments');
	var cursor = collection.find();
	cursor.batchSize(50);
	cursor.toArray(function(err, docs) {
		callback(err, docs);
	});
}
exports.getChildCommentsForParent = function(parentCommentID, callback) {
	var commentCollection = mongoUtil.getDBContext().collection('comments');
	commentCollection.find(
	{
		parentCommentID: parentCommentID
	})
	.toArray(function(docs, err) {
		callback(err, docs);
	});
}
exports.getChildCommentsForEntity = function(entityID, callback) {
	var commentCollection = mongoUtil.getDBContext().collection('comments');
	commentCollection.find(
		{entityID: entityID})
	.toArray(function(err, docs) {
		callback(err, docs);
	});
}