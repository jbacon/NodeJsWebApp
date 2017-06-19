import $ from 'jquery'
import Cookie from 'cookie'

var VISITOR_TYPE = {
	ANONYMOUS: 'ANONYMOUS',
	ADMIN: 'ADMIN',
	USER: 'USER'
}
// Level 1 - SERVICES (e.i. Comments API, Article API, )
// Level 2 - ACCESSES (unique to service... e.i. create_own)
// Level 3 - ROLES (e.i. Anonymous, Admin, User)
var IDENTITY_ACCESS_MANAGMENT_LIST = {
	// Service Level
	COMMENTS: {
		// Access Level
		VOTE: { ADMIN: true, USER: true, ANONYMOUS: false },
		CREATE: { ADMIN: true, USER: true, ANONYMOUS: false },
		READ: { ADMIN: true, USER: true, ANONYMOUS: true },
		UPDATE_OWN: { ADMIN: true, USER: true, ANONYMOUS: false },
		UPDATE_ALL: { ADMIN: true, USER: false, ANONYMOUS: false },
		DELETE_OWN: { ADMIN: true, USER: true, ANONYMOUS: false },
		DELETE_ALL: { ADMIN: true, USER: false, ANONYMOUS: false }
	},
	ARTICLES: {
		UP_VOTE: { ADMIN: true, USER: true, ANONYMOUS: false },
		DOWN_VOTE: { ADMIN: true, USER: true, ANONYMOUS: false },
		CREATE: { ADMIN: true, USER: false, ANONYMOUS: false },
		READ: { ADMIN: true, USER: true, ANONYMOUS: true },
		UPDATE: { ADMIN: true, USER: false, ANONYMOUS: false },
		DELETE: { ADMIN: true, USER: false, ANONYMOUS: false }
	},
	ACCOUNTS: {
		CREATE: { ADMIN: true, USER: false, ANONYMOUS: true },
		READ: { ADMIN: true, USER: false, ANONYMOUS: false },
		UPDATE_OWN: { ADMIN: true, USER: true, ANONYMOUS: false },
		UPDATE_ALL: { ADMIN: true, USER: false, ANONYMOUS: false },
		DELETE_OWN: { ADMIN: true, USER: true, ANONYMOUS: false },
		DELETE_ALL: { ADMIN: true, USER: false, ANONYMOUS: false }
	}
}
document.onreadystatechange = function () {
  if (document.readyState === 'complete' || document.readyState === 'interactive' || document.readyState === 'loaded') {
    applyDynamicStylization.call(this)
	// Listen for Click events on Comments section
	document.getElementById('comments').addEventListener('click', function(event) {
		if(event.target.classList.contains('replies-toggle')) {
			if(event.target.textContent == 'Hide Replies') {
				event.target.textContent = 'Show Replies';
				event.target.nextElementSibling.classList.add('hidden')
			}
			else { // Load First Page of Comments
				event.target.textContent = 'Hide Replies';
				event.target.nextElementSibling.classList.remove('hidden')
				if(event.target.nextElementSibling.childNodes.length === 0) {
					const client = new XMLHttpRequest();
					client.onreadystatechange = function() {
						this.responseXML
						if (this.readyState === XMLHttpRequest.DONE) {
							const response = JSON.parse(this.response);
							if(this.status === 200) {
								const comments = response.data;
								var commentsHtml = '';
								event.target.nextElementSibling.dataset.lastCount = comments.length;
								if(event.target.nextElementSibling.dataset.lastCount === 10) { // Full Page found (implies potential for next page...)
									event.target.nextElementSibling.dataset.nextPage++;
								}
								var parser = new DOMParser()
								for(var i = 0; i < comments.length; i++) {
									const commentHtml = generatehtmlforcomment({
										comment: comments[i],
										authorizedDelete: IDENTITY_ACCESS_MANAGMENT_LIST.COMMENTS.DELETE_OWN[getVisitorType()],
										authorizedCreate: IDENTITY_ACCESS_MANAGMENT_LIST.COMMENTS.CREATE[getVisitorType()]
									});
									event.target.nextElementSibling.insertAdjacentHTML('beforeend', commentHtml)
								}
								applyDynamicStylization.call(this)
							}
							else {
								alert('Error getting comments. '+this.status +' - '+this.statusText+'. '+response.message);
							}
						}
					}
					const query = {}
					query.query = {}
					query.query.articleID = document.getElementById('article-header').dataset.articleId || null;
					query.query.parentCommentID = event.target.parentElement.parentElement.dataset.id || null;
					query.pageSize = 10;
					query.pageNum = event.target.nextElementSibling.dataset.nextPage || 1;
					query.skip = (event.target.nextElementSibling.dataset.lastCount &&
						event.target.nextElementSibling.dataset.lastCount !== 10) || 0;
					const queryString = JSON.stringify(query);
					const encodedQuery = encodeURIComponent(queryString);
					client.open('GET', '/comments/read?data='+encodedQuery);
					client.send();
				}
			}
		}
		if(event.target.classList.contains('reply-toggle')) {
			if(event.target.innerHTML === 'Reply') {
				event.target.innerHTML = 'Cancel'
				event.target.nextElementSibling.classList.remove('hidden')
			}
			else {
				event.target.innerHTML = 'Reply'
				event.target.nextElementSibling.classList.add('hidden')
			}
		}
		if(event.target.classList.contains('delete')) {
			const client = new XMLHttpRequest();
			client.onreadystatechange = function() {
				this.responseXML
				if (this.readyState === XMLHttpRequest.DONE) {
					const response = JSON.parse(this.response);
					if(this.status === 200) {
						event.target.parentElement.parentElement.remove()
					}
					else {
						alert('Error deleting comments. '+this.status +' - '+this.statusText+'. '+response.message);
					}
				}
			}
			client.open('POST', '/comments/delete');
			client.setRequestHeader("Content-Type", "application/json");
			var data = {}
			data._id = event.target.parentElement.parentElement.dataset['id'] || null;
			client.send(JSON.stringify(data));
		}
		if(event.target.classList.contains('up-vote')) {

		}
		if(event.target.classList.contains('down-vote')) {

		}
		if(event.target.classList.contains('load-more')) {
			const client = new XMLHttpRequest();
			client.onreadystatechange = function() {
				this.responseXML
				if (this.readyState === XMLHttpRequest.DONE) {
					const response = JSON.parse(this.response);
					if(this.status === 200) {
						const comments = response.data;
						var commentsHtml = '';
						for(var key in comments) {
							commentsHtml += generatehtmlforcomment({
								comment: comments[key],
								authorizedDelete: IDENTITY_ACCESS_MANAGMENT_LIST.COMMENTS.DELETE_OWN[getVisitorType()],
								authorizedCreate: IDENTITY_ACCESS_MANAGMENT_LIST.COMMENTS.CREATE[getVisitorType()]
							});
						}
						event.target.nextElementSibling.innerHTML = commentsHtml
						applyDynamicStylization.call(this)
					}
					else {
						alert('Error getting comments. '+this.status +' - '+this.statusText+'. '+response.message);
					}
				}
			}
			// Build query. If last page # queried didn't return a complete page of comments
			// query for any new comments in the current page, otherwise query for next page of comments.
			const query = {}
			query.query = {}
			query.query.articleID = document.getElementById('article-header').dataset['articleId'] || null;
			query.query.parentCommentID = event.target.parentElement.parentElement.dataset['id'] || null;
			query.pageSize = 10;
			query.pageNum = event.target.parentElement.parentElement.dataset.nextPage || 1;
			query.skip = (event.target.parentElement.parentElement.dataset.lastCount &&
				event.target.parentElement.parentElement.dataset.lastCount !== 10) || 0;
			const queryString = JSON.stringify(query);
			const encodedQuery = encodeURIComponent(queryString);
			client.open('GET', '/comments/read?data='+encodedQuery);
			client.send();
		}
	});
	// Listen for Submit events on Comments sections (create comment form)
	document.getElementById('comments').addEventListener('submit', function(event) {
		if(event.target.classList.contains('create')) {
			event.preventDefault();
			const client = new XMLHttpRequest();
			client.onreadystatechange = function() {
				this.responseXML
				if (this.readyState === XMLHttpRequest.DONE) {
					const response = JSON.parse(this.response);
					if(this.status === 200) {
						var responseJson = JSON.parse(this.response);
						var commentHtml = generatehtmlforcomment({ 
							comment: responseJson.data,
							authorizedDelete: IDENTITY_ACCESS_MANAGMENT_LIST.COMMENTS.DELETE_OWN[getVisitorType()],
							authorizedCreate: IDENTITY_ACCESS_MANAGMENT_LIST.COMMENTS.CREATE[getVisitorType()]
						});
						event.target.previousElementSibling.previousElementSibling.previousElementSibling.innerHTML += commentHtml  
					}
					else {
						alert('Error creating comments. '+this.status +' - '+this.statusText+'. '+response.message);
					}
				}
			}
			client.open('POST', '/comments/create');
			client.setRequestHeader("Content-Type", "application/json");
			var jsonData = {}
			for(var i = 0; i < event.target.length - 1; i++) {
				jsonData[event.target.elements[i].name] = event.target.elements[i].value;
			}
			client.send(JSON.stringify(jsonData));

		}
	});

	// var observerComments = new MutationObserver(function(mutations) {
	//     mutations.forEach(function(mutation) {
	//         if (mutation.addedNodes && mutation.addedNodes.length > 0) {
	//             // element added to DOM
	//             var hasClass = [].some.call(mutation.addedNodes, function(el) {
	//                 return el.classList.contains('MyClass')
	//             });
	//             if (hasClass) {
	//                 // element has class `MyClass`

	//                 console.log('element ".MyClass" added');
	//             }
	//         }
	//     });
	// });
	// observerComments.observe(document.getElementById('comments'), 
	// 	{
	// 	    attributes: true,
	// 	    childList: true,
	// 	    characterData: true
	// 	}
	// );
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
	$('#login-form').submit(function(e) {
		e.preventDefault()
		$.ajax({
			context: this,
			type: 'POST',
			data: $(this).serialize(),
			url: '/auth/local/token'
		}).done(function(response) {
			applyDynamicStylization()
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
	$('#logout').on('click', function() {
		$.ajax({
			context: this,
			type: 'POST',
			url: '/auth/local/logout'
		}).done(function(response) {
			applyDynamicStylization()
			alert('Logout Succesful!')
		}).fail(function(response) {
			alert('Logout failed. '+response.statusText+' - '+response.status+'. '+response.responseJSON.message)
		});
	});
}
// Alters U.I. based on current User authorization.
function applyDynamicStylization() {
	var user = getCurrentUser()
	var visitorType = getVisitorType()
	// Login
	if(user) {
		var greetingElement = document.getElementById('greeting')
		greetingElement.classList.remove('hidden')
		greetingElement.innerHTML = 'Hello, '+user.nameFirst+' '+user.nameLast
		document.getElementById('logout').classList.remove('hidden')
		document.getElementById('register').classList.add('hidden')
		document.getElementById('login').classList.add('hidden')
	}
	else {
		var greetingElement = document.getElementById('greeting')
		greetingElement.classList.add('hidden')
		greetingElement.innerHTML = ''
		document.getElementById('logout').classList.add('hidden')
		document.getElementById('register').classList.remove('hidden')
		document.getElementById('login').classList.remove('hidden')
	}
	// Comments
	var commentElement = document.getElementById('comments')
	commentElement.querySelectorAll('create, reply-toggle').forEach((node) => { 
		if(IDENTITY_ACCESS_MANAGMENT_LIST.COMMENTS.CREATE[visitorType])
			node.classList.add('hidden') 
		else
			node.classList.remove('hidden')
	})
	commentElement.querySelectorAll('delete').forEach((node) => { 
		if(VISISTOR_AUTHORIZATION.COMMENTS.DELETE_OWN[visitorType])
			node.classList.add('hidden') 
		else
			node.classList.remove('hidden')
	})
	commentElement.querySelectorAll('up-vote, down-vote').forEach((node) => { 
		if(VISISTOR_AUTHORIZATION.COMMENTS.VOTE[visitorType])
			node.classList.add('hidden') 
		else
			node.classList.remove('hidden')
	})
}
function getVisitorType() {
	var user = getCookie('loggedInUser');
	if(!user) {
		return VISITOR_TYPE.ANONYMOUS
	}
	else if(user.admin === true) {
		return VISITOR_TYPE.ADMIN
	}
	else {
		return VISITOR_TYPE.USER
	}
}
function getCurrentUser() {
	var user = getCookie('loggedInUser');
	if(!user) return null;
	return JSON.parse(user.slice(2,user.length))
}
function getCookie(name) {
	var cookie = Cookie.parse(document.cookie);
	return cookie[name];
}