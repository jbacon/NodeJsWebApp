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
			.sibling(".comment")
			.data("commentID");
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
					var parentCommentID = $(this).parent().data("comemntID");
					var entityID = $(this).parent().data("entityID");
					getComments(entityID, parentCommentID, 
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
});

function createHTMLForComment(comment) {
	var commentHtml = "";
	commentHtml += "<article class='comment' data-commentID='";
	commentHtml += comment._id;
	commentHtml += " data-entityID='";
	commentHtml += comment.entityID;
	commentHtml += "'>";
	commentHtml += "<h1>";
	commentHtml += comment.commenterName;
	commentHtml += "</h1>";
	commentHtml += "<p>";
	commentHtml += comment.commentText;
	commentHtml += "</p>";
	commentHtml += "<footer>";
	commentHtml += "<span class='toggleReply'>Reply</span>";
	commentHtml += "<span class='up-count'>1</span>";
	commentHtml += "<span class='up-vote'>Up</span>";
	commentHtml += "<span class='down-count'>2</span>";
	commentHtml += "<span class='down-vote'>Down</span>";
	commentHtml += "<div class='toggleReplies'>Show Replies</div>";
	commentHtml += "<div class='replies' style='display: none;'></div>";
	commentHtml += "<div class='create' style='display: none;'>";
	commentHtml += "<input class='name'>";
	commentHtml += "<input class='text'>";
	commentHtml += "<button class='submit'>Submit</button>";
	commentHtml += "</div>";
	commentHtml += "</footer>";
	commentHtml += "</article>";
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