function getComments({ commentID=undefined, articleID=undefined, parentCommentID=undefined, pageSize=10, pageNum=1 } = {}, callback) {
	$.ajax({
		context: this,
		type: 'GET',
		data: {
			articleID: articleID,
			parentCommentID: parentCommentID,
			pageSize: pageSize, 
			pageNum: pageNum 
		},
		url: '/comments/getComments',
		dataType: 'JSON'
	}).done(function(response) {
		callback.call(this, response.error, response.data);
	}).fail(function(response) {
		callback.call(this, response.error)
	});
}
function postComment({ comment } = {}, callback) {
	$.ajax({
		context: this,
		type: 'POST',
		data: {
			comment: comment
		},
		url: '/comments/createComment',
		dataType: 'JSON'
	}).done(function(response) {
		callback.call(this, response.error, response.data)
	}).fail(function(response) {
		callback.call(this, response)
	});
}
function deleteComment({ commentID } = {}, callback) {
	$.ajax({
		context: this,
		type: 'POST',
		data: {
			commentID: commentID
		},
		url: '/comments/deleteComment',
		dataType: 'JSON'
	})
	.done(function(response) {
		callback.call(this, response.error, response.data)
	})
	.fail(function(response) {
		callback.call(this, response.error)
	});
}

function getArticle({ articleID } = {}, callback) {

}
function postArticle({ article } = {}, callback) {

}
function deleteArticle({ articleID } = {}, callback) {

}
function updateArticle({ articleID } = {}, callback) {

}