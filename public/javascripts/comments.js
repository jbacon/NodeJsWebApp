function getComments({ _id=undefined, articleID=undefined, parentCommentID=undefined, pageSize=10, pageNum=1 } = {}, callback) {
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
function deleteComment({ _id } = {}, callback) {
	$.ajax({
		context: this,
		type: 'POST',
		data: {
			_id: _id
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
function incrementUpVoteCount({ _id } = {}, callback) {
	$.ajax({
		context: this,
		type: 'POST',
		data: {
			_id: _id
		},
		url: '/comments/incrementUpVoteCount',
		dataType: 'JSON'
	})
	.done(function(response) {
		callback.call(this, response.error, response.data)
	})
	.fail(function(response) {
		callback.call(this, response.error)
	});
}
function incrementDownVoteCount({ _id } = {}, callback) {
	$.ajax({
		context: this,
		type: 'POST',
		data: {
			_id: _id
		},
		url: '/comments/incrementDownVoteCount',
		dataType: 'JSON'
	})
	.done(function(response) {
		callback.call(this, response.error, response.data)
	})
	.fail(function(response) {
		callback.call(this, response.error)
	});
}