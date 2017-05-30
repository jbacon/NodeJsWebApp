$(document).ready(function() {
	//Allows JQuery to select static AND dynamic content
	$('#comments').on('click', '.submit', function() {
		postComment.call(this, 
			{
				comment: {
					name: $(this)
						.siblings(".name")
						.val(),
					text: $(this)
						.siblings(".text")
						.val(),
					articleID: $('#article-header')
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
					var commentHtml = commentHtmlGenerator(comment);
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
						.siblings('.reply-toggle')
						.trigger('click');
				}
			}
		);
	});
	$("#comments").on('click', '.replies-toggle', function() {
		if($(this).text() == "Hide Replies") {
			$(this).text('Show Replies');
			$(this).siblings(".replies").hide();
		}
		else {
			$(this).text('Hide Replies');
			$(this).siblings(".replies").show();
			if(!($(this).siblings(".replies").html().length > 0)) {
				getComments.call(this, 
					{ 
						articleID: $('#article-header')
							.data("article-id"), 
						parentCommentID: $(this)
							.parent()
							.parent()
							.data("id")
					}, 
					function(err, comments) {
						if(err) {
							alert('Failed to get comments'+err)
						} else {
							var commentsHtml = "";
							$.each(comments, function(i, comment) {
								commentsHtml += commentHtmlGenerator(comment)
							});
							$(this).siblings(".replies").html(commentsHtml);
						}
					}
				);
			}
		}
	});
	$("#comments").on('click', '.reply-toggle', function() {
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
		deleteComment.call(this, 
			{ 
				_id: $(this)
					.parent()
					.parent()
					.data("id") 
			}, 
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
	$("#comments").on('click', '.up-vote', function() {
		incrementUpVoteCount.call(this, 
			{ 
				_id: $(this)
					.parent()
					.parent()
					.data("id") 
			}, 
			function(err, data) {
				if(err) {
					alert('Failed to upVote comment'+err)
				} else {
					//Increase U.I. Count
					$(this)
						.parent()
						.parent()
						.remove();
				}
			}
		);
	});
	$("#comments").on('click', '.down-vote', function() {
		incrementDownVoteCount.call(this, 
			{ 
				_id: $(this)
					.parent()
					.parent()
					.data("id") 
			}, 
			function(err, data) {
				if(err) {
					alert('Failed to downVote comment'+err)
				} else {
					//Increase U.I. Count
					$(this)
						.parent()
						.parent()
						.remove();
				}
			}
		);
	});
});