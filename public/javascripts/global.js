$(document).ready(function() {
	var entityID = '1234';
	loadComments(entityID);
});

function generateCreateCommentHtml(entityID, parentCommentID) {
	var createCommentHtml;
	createCommentHtml += "<div class='comment-create' ";
	if(entityID != undefined)
		createCommentHtml += "data-entityID='"+entityID+"'' ";
	if(parentCommentID != undefined)
		createCommentHtml += "data-parentCommentID='"+parentCommentID+"'' ";
	createCommentHtml += ">";
	createCommentHtml += "<input type='text' placeholder='Comment Text...' >";
	createCommentHtml += "<button>Submit</button>";
	createCommentHtml += "</div>";
	return createCommentHtml;
}

function loadComments(entityID) {
	var commentHtml;

	//JQuery AJAX Call for JSON object
	//$.getJSON('/comments/getChildCommentsForEntity', entityID, function(err, data) {
	$.getJSON('/comments/getAllComments', function(err, data) {
		//Foreach Item in JSON
		$.each(data, function() {
			commentHtml += "<div class='comment'>";
			commentHtml += "<div class='commenter-name'>"+this.commentorName+"</div>";
			commentHtml += "<div class='comment-text'>"+this.commentText+"</div>";
			commentHtml += "<div class='comment-footer'>";
			commentHtml += "<span class='comment-reply>Reply</span>";
			commentHtml += "<span class='comment-up-count>"+this.countUpVote+"</span>";
			commentHtml += "<span class='comment-up-vote>UpVote</span>";
			commentHtml += "<span class='comment-down-count>"+this.countDownVote+"</span>";
			commentHtml += "<span class='comment-down-vote>DownVote</span>";
			commentHtml += "</div>";
			commentHtml += "</div>";
		});
	});
	commentHtml += generateCreateCommentHtml(entityID);
$('.main-comments').html(commentHtml);
}
$('.SubmitComment').on('click', function() {
	//Find Comment details
	//Submit
});
/*
function createComment(event, params) {
	event.preventDefault();
	var entityID = params.entityID;
	var parentCommentID = params.parentCommentID;
	//Basic Validation
	var errorCount = 0;
	$('#addComment input').each(function(index, val) {
		if($(this).val() === '') { errorCount++; }
	});
	//Check error count
	if(errorCount === 0) {

		$.ajax({
			type: 'POST',
			data: new
		})
	}
}
*/