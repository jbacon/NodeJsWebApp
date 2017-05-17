$(document).ready(function() {
	var entityID = '1234';	//For Testing Purposes
	//Load Existing Comments
	getComments({ entityID: entityID, pageSize: 10, pageNum: 1 }, function(err, comments) {
		if(err) {
			
		} else {
			var commentsHtml = "";
			$.each(comments, function(i, comment) {
				commentsHtml += createHTMLForComment(comment)
			})
			$("#comments").children('h1').after(commentsHtml);
		}
	});
	//Allows JQuery to select static AND dynamic content
	$('#comments').on('click', '.submit', function() {
		//Steps:
		//	1) Use JQuery to find & construct Comment object
		//	2) Verify/Validate Comment
		//	3) User Ajax to POST comment.
		//	4) Check error and/or update U.I.
		var comment = { };
		comment.commenterName = $(this)
			.siblings(".name")
			.val();
		comment.commentText = $(this)
			.siblings(".text")
			.val();
		comment.parentCommentID = $(this)
			.parent()
			.parent()
			.parent()
			.data("comment-id");
		//comment.parentCommentID = null;
		comment.entityID = "1234";

		postComment(comment, function(err, comment) {
			if(err) {
				//Through Error
			} else {
				//Add to U.I.
				var commentHtml = createHTMLForComment(comment);
				$(this).parent().siblings(".replies").append(commentHtml);
			}
		});
	});
	$("#comments").on('click', '.toggleReplies', function() {
		if($(this).text() == "Hide Replies") {
			$(this).text('Show Replies');
			$(this).siblings(".replies").hide();
		}
		else {
			$(this).text('Hide Replies');
			$(this).siblings(".replies").show();
			if(!($(this).siblings(".replies").html().length > 0)) {
				var parentCommentID = $(this)
					.parent()
					.data("comemnt-id");
				var entityID = $(this)
					.parent()
					.data("entity-id");
				getComments({ entityID: entityID, parentCommentID: parentCommentID }, 
					function(err, comments) {
						if(err) {
							
						} else {
							var commentsHtml = "";
							$.each(comments, function(i, comment) {
								commentsHtml += createHTMLForComment(comment)
							});
							$(this).siblings(".replies").html(commentsHtml);
						}
					}
				);
			}
		}
	});
	$("#comments").on('click', '.toggleReply', function() {
		if($(this).text() == "Reply") {
			$(this).text('Cancel');
			$(this)
				.siblings(".create").show();
		}
		else {
			$(this).text('Reply');
			$(this)
				.siblings(".create").hide();
		}
	});
	$("#comments").on('click', '.delete', function() {
		commentID = $(this)
			.parent()
			.parent()
			.data("comment-id")
		entityID = $(this)
			.parent()
			.parent()
			.data("entity-id")
		deleteComment({ entityID: entityID, commentID: commentID }, 
			function(err, data) {
				if(err) {
					//Through Error
				} else {
					//Remove from U.I.
					$(this)
						.parent()
						.parent()
						.remove();
				}
			}
		);
	});
});

function createHTMLForComment(comment) {
	var commentHtml =
		"<article class='comment' data-comment-id='"+comment._id+"' data-entity-id='"+comment.entityID+"'>" +
		"<h1>"+comment.commenterName+"</h1>" +
		"<p>"+comment.commentText+"</p>" +
		"<footer>" +
		"<span class='up-count'>1</span>" +
		"<span class='up-vote'>Up</span>" +
		"<span class='down-count'>2</span>" +
		"<span class='down-vote'>Down</span>" +
		"<span class='delete'>Delete</span>" +
		"<div class='toggleReplies'>Show Replies</div>" +
		"<div class='replies' style='display: none;'></div>" +
		"<div class='toggleReply'>Reply</div>" +
		"<div class='create' style='display: none;'>" +
		"<input class='name'>" +
		"<input class='text'>" +
		"<button class='submit'>Submit</button>" +
		"</div>" +
		"</footer>" +
		"</article>";
	return commentHtml;
}

function getComments({ entityID, parentCommentID, pageSize=10, pageNum=1 } = {}, callback) {
	$.ajax({
		type: 'GET',
		data: { 
			entityID: entityID, 
			parentCommentID: parentCommentID, 
			pageSize: pageSize, 
			pageNum: pageNum },
		url: '/comments/getComments',
		dataType: 'JSON'
	}).done(function(response) {
		callback(response.error, response.data);
	}).fail(function(response) {
		callback(response.error)
	});	
}
function postComment(comment, callback) {
	$.ajax({
		type: 'POST',
		data: comment,
		url: '/comments/createComment',
		dataType: 'JSON'
	}).done(function(response) {
		callback(response.error, response.data)
	}).fail(function(response) {
		callback(response.error)
	});
}
function deleteComment({ entityID, commentID } = {}, callback) {
	$.ajax({
		type: 'POST',
		data: {
			entityID: entityID,
			commentID: commentID },
		url: '/comments/deleteComment',
		dataType: 'JSON'
	})
	.done(function(response) {
		callback(response.error, response.data)
	})
	.fail(function(response) {
		callback(response.error)
	});
}