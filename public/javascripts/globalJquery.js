import $ from 'jquery'
import Cookie from 'cookie'

$(document).ready(function() { // Page Load and/or Referesh
	// Confgure U.I. based on Cookies set... (Single Page Applciation)
	refreshAllowedFields.call(this)
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
						query: {
							articleID: $('#article-header')
								.data("article-id") || null, 
							parentCommentID: $(this)
								.parent()
								.parent()
								.data("id") || null
							},			
						pageSize: 10,
						pageNum: 1
					},
					url: '/comments/read',
					dataType: 'JSON'
				}).done(function(response) {
					var commentsHtml = ''
					$.each(response.data, function(i, comment) {
						commentsHtml += generatehtmlforcomment(comment)
					});
					$(this).siblings(".replies").html(commentsHtml);
					// refreshAllowedFields.call(this)
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
	$('#comments').on('submit', 'form.create', function(e) {
		e.preventDefault()
		$.ajax({
			context: this,
			type: 'POST',
			data: $(this).serialize(),
			url: '/comments/create',
			dataType: 'JSON'
		}).done(function(response) {
			//Add to U.I.
			var commentHtml = generatehtmlforcomment(response.data);
			$(this)
				.siblings(".replies")
				.append(commentHtml);
			//Clear input fields
			$(this)
				.children(".text")
				.val('');
			$(this)
				.siblings('.reply-toggle')
				.trigger('click');
			// refreshAllowedFields.call(this)
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
			url: '/auth/local/token'
		}).done(function(response) {
			refreshAllowedFields.call(this)
			$('#login-modal-box--close')[0].click();
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
			url: '/auth/local/register'
		}).done(function(response) {
			$('#register-modal-box--close')[0].click();
			alert('Registeration Succesful! Try logging in..')
		}).fail(function(response) {
			alert('Registeration failed. '+response.statusText+' - '+response.status+'. '+response.responseJSON.message)
		});
	});
	$('a.logout').on('click', function() {
		$.ajax({
			context: this,
			type: 'POST',
			url: '/auth/local/logout'
		}).done(function(response) {
			refreshAllowedFields.call(this)
			alert('Logout Succesful!')
		}).fail(function(response) {
			alert('Logout failed. '+response.statusText+' - '+response.status+'. '+response.responseJSON.message)
		});
	});
});

var observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
        if (mutation.addedNodes && mutation.addedNodes.length > 0) {
            // element added to DOM
            var hasClass = [].some.call(mutation.addedNodes, function(el) {
                return el.classList.contains('MyClass')
            });
            if (hasClass) {
                // element has class `MyClass`

                console.log('element ".MyClass" added');
            }
        }
    });
});
observer.observe(document.body, 
	{
	    attributes: true,
	    childList: true,
	    characterData: true
	}
);

function refreshAllowedFields() {
	var cookie = Cookie.parse(document.cookie);
	if(cookie.loggedInUser) {
		var user = JSON.parse(cookie.loggedInUser.slice(2,cookie.loggedInUser.length))
		$('a.greeting').html('Hello, '+user.nameFirst+' '+user.nameLast);
		$('a.greeting').show();
		$('a.login').hide();
		$('a.logout').show();
		$('a.register').hide();
		$('#comments').find('.reply-toggle').show()
		$('#comments').find('.delete').show()
		$('#comments').find('.create').show()
		$('#comments').find('.up-vote').show()
		$('#comments').find('.down-vote').show()
	}
	else {
		$('a.greeting').html('');
		$('a.greeting').hide();
		$('a.login').show();
		$('a.logout').hide();
		$('a.register').show();
		$('#comments').find('.reply-toggle').hide()
		$('#comments').find('.delete').hide()
		$('#comments').find('.create').hide()
		$('#comments').find('.up-vote').hide()
		$('#comments').find('.down-vote').hide()
	}
}