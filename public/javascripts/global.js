$(document).ready(function() {
	//Allows JQuery to select static AND dynamic content
	$('#comments').on('click', '.submit', function() {
		//Steps:
		//	1) Use JQuery to find & construct Comment object
		//	2) Verify/Validate Comment
		//	3) User Ajax to POST comment.
		//	4) Check Result:
		//		a) Success:
		//			1. Dynamically add new content
		//			2. Clear form fields.
		//			3. Click ToggleReply button (to hide comment form)
		//		b) Error:
		//			1. Dynamically add new contne
		postComment.call(this, 
			{
				comment: {
					name: $(this)
						.siblings(".name")
						.val(),
					text: $(this)
						.siblings(".text")
							.val(),
					articleID: $('#main-content')
						.data("article-id"),
					parentCommentID: $(this)
						.parent()
						.parent()
						.parent()
						.data("id")
				}
			}, 
			function(err, comment) {
				if(err) {
					alert("failed to create comment"+err)
				} else {
					//Add to U.I.
					var commentHtml = createHTMLForComment(comment);
					$(this)
						.parent()
						.siblings(".replies")
						.append(commentHtml);
					//Clear input fields
					$(this)
						.siblings(".name")
						.val('');
					$(this)
						.siblings(".text")
						.val('');
					$(this)
						.parent()
						.siblings('.toggleReply')
						.trigger('click');
				}
			}
		);
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
					.parent()
					.parent()
					.data("id");
				var articleID = $('#main-content')
					.data("article-id");
				getComments.call(this, { articleID: articleID, parentCommentID: parentCommentID }, 
					function(err, comments) {
						if(err) {
							alert('Failed to get comments'+err)
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
		var commentID = $(this)
			.parent()
			.parent()
			.data("id")
		deleteComment.call(this, 
			{ commentID: commentID }, 
			function(err, data) {
				if(err) {
					alert('Failed to delete comment'+err)
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
		"<article class='comment' data-id='"+comment._id+"' data-article-id='"+comment.articleID+"'>" +
		"<h1>"+comment.name+"</h1>" +
		"<p>"+comment.text+"</p>" +
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