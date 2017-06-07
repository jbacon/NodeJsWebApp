$(document).ready(function() {
	$('#comments').on('click', '.replies-toggle', function() {
		if($(this).text() == "Hide Replies") {
			$(this).text('Show Replies');
			$(this).siblings(".replies").hide();
		}
		else {
			$(this).text('Hide Replies');
			$(this).siblings(".replies").show();
			if(!($(this).siblings(".replies").html().length > 0)) {
				$.ajax({
					context: this,
					type: 'GET',
					data: {						
						articleID: $('#article-header')
							.data("article-id"), 
						parentCommentID: $(this)
							.parent()
							.parent()
							.data("id"),
						pageSize: 10, 
						pageNum: 1 
					},
					url: '/comments/read',
					dataType: 'JSON'
				}).done(function(response) {
					//Add to U.I.
					var commentHtml = generatehtmlforcomment(response.data);
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
				}).fail(function(response) {
					alert('Error getting comments. '+response.statusText+' - '+response.status+'. '+response.responseJSON.message)
				});
			}
		}
	});
	$('#comments').on('click', '.reply-toggle', function() {
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
	$('#comments').on('click', '.delete', function() {
		$.ajax({
			context: this,
			type: 'POST',
			data: {
				_id: $(this)
					.parent()
					.parent()
					.data("id") 
			},
			url: '/comments/delete',
			dataType: 'JSON'
		}).done(function(response) {
			$(this)
				.parent()
				.parent()
				.remove();
		}).fail(function(response) {
			alert('Error deleting comment. '+response.statusText+' - '+response.status+'. '+response.responseJSON.message)
		});
	});
	$('#comments').on('click', '.up-vote', function() {
		$.ajax({
			context: this,
			type: 'POST',
			data: {
				_id: $(this)
					.parent()
					.parent()
					.data("id") 
			},
			url: '/comments/incrementUpVoteCount',
			dataType: 'JSON'
		}).done(function(response) {
			$(this)
				.parent()
				.parent()
				.remove();
		}).fail(function(response) {
			alert('Error deleting comment. '+response.statusText+' - '+response.status+'. '+response.responseJSON.message)
		});
	});
	$('#comments').on('click', '.down-vote', function() {
		$.ajax({
			context: this,
			type: 'POST',
			data: {
				_id: $(this)
					.parent()
					.parent()
					.data("id") 
			},
			url: '/comments/incremntDownVoteCount',
			dataType: 'JSON'
		}).done(function(response) {
			$(this)
				.parent()
				.parent()
				.remove();
		}).fail(function(response) {
			alert('Error deleting comment. '+response.statusText+' - '+response.status+'. '+response.responseJSON.message)
		});
	});
	$('#comments').on('click', 'form.create', function(e) {
		e.preventDefault()
		$.ajax({
			context: this,
			type: 'POST',
			data: $(this).serialize(),
			url: '/comments/create',
			dataType: 'JSON'
		}).done(function(response) {
			//Add to U.I.
			var commentHtml = commentHtmlGenerator(response.data);
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
		}).fail(function(response) {
			alert('Error creating comment. '+response.statusText+' - '+response.status+'. '+response.responseJSON.message)
		});
	});
	$('#login-form').submit(function(e) {
		e.preventDefault()
		$.ajax({
			context: this,
			type: 'POST',
			data: $(this).serialize(),
			url: '/auth/local/login',
			dataType: 'JSON'
		}).done(function(response) {
			alert('Login Succesful!')
		}).fail(function(response) {
			alert('Login failed. '+response.statusText+' - '+response.status+'. '+response.responseJSON.message)
		});
	});
	$('#register-form').submit(function(e) {
		e.preventDefault()
		$.ajax({
			context: this,
			type: 'POST',
			data: $(this).serialize(),
			url: '/auth/local/register',
			dataType: 'JSON'
		}).done(function(response) {
			alert('Registeration Succesful! Try logging in..')
		}).fail(function(response) {
			alert('Registeration failed. '+response.statusText+' - '+response.status+'. '+response.responseJSON.message)
		});
	});
	$('a.logout').on('click', function() {
		$.ajax({
			context: this,
			type: 'POST',
			data: $(this).serialize(),
			url: '/auth/local/logout',
			dataType: 'JSON'
		}).done(function(response) {
			alert('Logout Succesful!')
		}).fail(function(response) {
			alert('Logout failed. '+response.statusText+' - '+response.status+'. '+response.responseJSON.message)
		});
	});
});