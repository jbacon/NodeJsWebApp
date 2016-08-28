$(document).ready(function() {
	var entityID = '1234';	//For Testing Purposes
	//Load Existing Comments
	getComments(entityID, null, function(err, comments) {
		if(err) {
			
		} else {
			var commentsHtml = "";
			$.each(comments, function(i, comment) {
				commentsHtml += createHTMLForComment(comment)
			})
			$("#comments").html(commentsHtml);
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
			.siblings(".input-fields")
			.children(".name")
			.val();
		comment.commentText = $(this)
			.siblings(".input-fields")
			.children(".text")
			.val();
		//comment.parentCommentID = null;
		comment.entityID = "1234";

		postComment(comment, function(err, comment) {
			if(err) {
				//Through Error
			} else {
				//Add to U.I.
			}
		});
	});
	$("#comments").on('click', '.reply', function() {
		//Steps:
		//	1) Unhide Create Comment Section relative to action
		//	3) Hide Reply Button
		$(this).hide();
		$(this).siblings(".reply-cancel").show();
	});
	$("#comments").on('click', '.cancel', function() {
		//Steps:
		//	1) Hide Create Comment section relative to action
		//	2) Unhide Reply Button
		$(this).hide();
		$(this).siblings(".reply").show();
	});
});

function createHTMLForComment(comment) {
	var commentHtml = "";
	commentHtml += "<div class='comment' data-commentID='";
	commentHtml += comment._id;
	commentHtml += "'>";
	commentHtml += "<div class='name'>";
	commentHtml += comment.commenterName;
	commentHtml += "</div>";
	commentHtml += "<div class='text'>";
	commentHtml += comment.commentText;
	commentHtml += "</div>";
	commentHtml += "<div class='footer'>";
	commentHtml += "<span class='reply'>Reply</span>";
	commentHtml += "<span class='reply-cancel'>Cancel</span>";
	commentHtml += "<span class='up-count'>1</span>";
	commentHtml += "<span class='up-vote'>Up</span>";
	commentHtml += "<span class='down-count'>2</span>";
	commentHtml += "<span class='down-vote'>Down</span>";
	commentHtml += "</div>";
	commentHtml += "<div class='create'>";
	commentHtml += "<div class='input-fields'>";
	commentHtml += "<input class='name'>";
	commentHtml += "<input class='text'>";
	commentHtml += "</div>";
	commentHtml += "<div class='submit'>Submit</div>";
	commentHtml += "</div>";
	commentHtml += "</div>";
	return commentHtml;
}

function getComments(entityID, parentCommentID, callback) {
	$.ajax({
		type: 'GET',
		data: { entityID: entityID, parentCommentID: parentCommentID },
		url: '/comments/getComments',
		dataType: 'JSON'
	}).done(function(response) {
		if(response.error) {
			callback(null, response.data)
		} else {
			callback(response.error, response.data);
		}
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
		if(response.error){
			callback(null, response.data)
		} else {
			callback(response.error, response.data)
		}
	}).fail(function(response) {
		callback(response.error)
	});
}