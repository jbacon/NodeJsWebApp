import $ from 'jquery'
import Cookie from 'cookie'

var VISITOR_TYPE = {
	ANONYMOUS: 'ANONYMOUS',
	ADMIN: 'ADMIN',
	USER: 'USER'
}
// IACL for U.I. PRESENTATION ONLY (data layer secured server side)
// Level 1 - SERVICES (e.i. Comments API, Article API, )
// Level 2 - ACCESSES (unique to service... e.i. create_own)
// Level 3 - ROLES (e.i. Anonymous, Admin, User)
var IDENTITY_ACCESS_CONTROL_LIST = {
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

// Prevents flickering of unstyled U.I. (where styling is programmatic)
document.body.classList.remove('hidden')

applyDynamicStylization.call(this)
// Listen for Click events on Comments section
document.getElementById('comments').addEventListener('click', function(event) {
	if(event.target.classList.contains('replies-toggle')) {
		var loadNew = event.target.nextElementSibling;
		var replies = event.target.nextElementSibling.nextElementSibling;
		var loadOld = event.target.nextElementSibling.nextElementSibling.nextElementSibling;
		var replyToggle = event.target.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling;
		var create = event.target.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling;
		if(event.target.textContent == 'Hide Replies') {
			event.target.textContent = 'Show Replies';
			loadNew.classList.add('hidden')
			replies.classList.add('hidden')
			loadOld.classList.add('hidden')
			create.classList.add('hidden')
			replyToggle.classList.add('hidden')
		}
		else { // Load First Page of Comments
			event.target.textContent = 'Hide Replies';
			loadNew.classList.remove('hidden')
			replies.classList.remove('hidden')
			loadOld.classList.remove('hidden')
			create.classList.remove('hidden')
			replyToggle.classList.remove('hidden')
			if(replies.childNodes.length === 0) { //Try loading comments if none exit
				loadComments({repliesElement: replies, newOrOldComments: 'OLD' })
			}
		}
	}
	if(event.target.classList.contains('reply-toggle')) {
		var create = event.target.nextElementSibling
		if(event.target.innerHTML === 'Reply') {
			event.target.innerHTML = 'Cancel'
			create.classList.remove('hidden')
		}
		else {
			event.target.innerHTML = 'Reply'
			create.classList.add('hidden')
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
		data._id = event.target.parentElement.parentElement.dataset.id || null;
		client.send(JSON.stringify(data));
	}
	if(event.target.classList.contains('up-vote')) {

	}
	if(event.target.classList.contains('down-vote')) {

	}
	if(event.target.classList.contains('load-newer')) {
		var replies = event.target.nextElementSibling
		loadComments({repliesElement: replies, newOrOldComments: 'NEW' })
	}
	if(event.target.classList.contains('load-older')) {
		var replies = event.target.previousElementSibling
		loadComments({repliesElement: replies, newOrOldComments: 'OLD'})
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
					// Programmatically click load latest comments...
					event.target.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling.click();
					applyDynamicStylization.call(this) 
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


function loadComments({repliesElement, newOrOldComments='OLD' }={}) {
	const query = {}
	if(newOrOldComments === 'OLD') { 
		// StartID is set to first comment of first page/batch query
		query.startID = repliesElement.dataset.startID
		query.sortOrder = -1
		query.pageNum = Number(repliesElement.dataset.pageNum || 1)
		query.skipOnPage = Number(repliesElement.dataset.skipOnPage || 0)
	}
	else if(newOrOldComments === 'NEW') { 
		// StartID is set to most recent comment (first child element)
		query.startID = repliesElement.firstElementChild.dataset.id
		query.sortOrder = 1
		query.pageNum = 1
	}
	query.pageSize = 10
	query.articleID = document.getElementById('article-header').dataset.articleId || null;
	query.parentCommentID = repliesElement.parentElement.parentElement.dataset.id || null;
	const queryString = JSON.stringify(query);
	const encodedQuery = encodeURIComponent(queryString);
	const client = new XMLHttpRequest();
	client.onreadystatechange = function() {
		this.responseXML
		if (this.readyState === XMLHttpRequest.DONE) {
			const response = JSON.parse(this.response);
			if(this.status === 200) {
				const comments = response.data;
				var insertMethod = ''
				if(newOrOldComments === 'NEW') { 
					insertMethod = 'afterbegin'
				}
				else if(newOrOldComments === 'OLD') {  
					if(!repliesElement.dataset.startID && comments.length > 0) {
						repliesElement.dataset.startID = comments[0]._id
					}
					repliesElement.dataset.skipOnPage = (comments.length < 10) ? comments.length : 0
					repliesElement.dataset.pageNum = (comments.length < 10) ? query.pageNum : query.pageNum+1
					insertMethod = 'beforeend'
				}
				for(var i = 0; i < comments.length; i++) {
					const commentHtml = generatehtmlforcomment({
						comment: comments[i],
						authorizedDelete: IDENTITY_ACCESS_MANAGMENT_LIST.COMMENTS.DELETE_OWN[getVisitorType()],
						authorizedCreate: IDENTITY_ACCESS_MANAGMENT_LIST.COMMENTS.CREATE[getVisitorType()]
					});
					repliesElement.insertAdjacentHTML(insertMethod, commentHtml)
				}
				applyDynamicStylization.call(this)
			}
			else {
				alert('Error getting comments. '+this.status +' - '+this.statusText+'. '+response.message);
			}
		}
	}
	client.open('GET', '/comments/read?data='+encodedQuery);
	client.send();
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
	commentElement.querySelectorAll('.create, .reply-toggle').forEach((node) => { 
		if(IDENTITY_ACCESS_MANAGMENT_LIST.COMMENTS.CREATE[visitorType]) {
			if(node.classList.contains('reply-toggle')) { 
				//Only reveal reply-toggle button, not actual create form
				node.classList.remove('hidden')
			}
		}
		else {
			node.classList.add('hidden')
		}
	})
	commentElement.querySelectorAll('.delete').forEach((node) => { 
		if(IDENTITY_ACCESS_MANAGMENT_LIST.COMMENTS.DELETE_OWN[visitorType])
			node.classList.remove('hidden') 
		else
			node.classList.add('hidden')
	})
	commentElement.querySelectorAll('.up-vote, .down-vote').forEach((node) => { 
		if(IDENTITY_ACCESS_MANAGMENT_LIST.COMMENTS.VOTE[visitorType])
			node.classList.remove('hidden') 
		else
			node.classList.add('hidden')
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

//Get Data
//Load Element
//Apply Style
//Global Update Style


