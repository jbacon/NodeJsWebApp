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
	/*if(params.subscriberID != undefined) 
		comment.subscriberID = params.subscriberID;*/

	var commentCollection = mongoUtil.getDBContext().collection('comments');
	commentCollection.insert(comment, function(err, result) {
		callback(err, result);
	});
}
exports.getAllComments = function(callback) {
	var commentCollection = mongoUtil.getDBContext().collection('comments');
	commentCollection.find().toArray(function(err, docs) {
		callback(err, docs);
	})
}
exports.getChildCommentsForParent = function(parentCommentID, callback) {
	var commentCollection = mongoUtil.getDBContext().collection('comments');
	commentCollection.find(
	{
		parentCommentID: parentCommentID
	})
	.toArray(function(docs, err) {
		callback(docs, err);
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