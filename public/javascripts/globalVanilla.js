import Cookie from 'cookie'

const VISITOR_TYPE = {
	ANONYMOUS: 'ANONYMOUS',
	ADMIN: 'ADMIN',
	USER: 'USER'
}
const PAGE_SIZE=5
// IACL for U.I. PRESENTATION ONLY (data layer secured server side)
// Level 1 - SERVICES (e.i. Comments API, Article API, )
// Level 2 - ACCESSES (unique to service... e.i. create_own)
// Level 3 - ROLES (e.i. Anonymous, Admin, User)
const IDENTITY_ACCESS_MANAGMENT_LIST = {
	// Service Level
	COMMENTS: {
		// Access Level
		READ: { ADMIN: true, USER: true, ANONYMOUS: true },
		VOTE: { ADMIN: true, USER: true, ANONYMOUS: false },
		CREATE: { ADMIN: true, USER: true, ANONYMOUS: false },
		DELETE: { ADMIN: true, USER: false, ANONYMOUS: false },
		REMOVE_OWN: { ADMIN: true, USER: true, ANONYMOUS: false },
		REMOVE_ALL: { ADMIN: true, USER: false, ANONYMOUS: false },
		FLAG: { ADMIN: true, USER: true, ANONYMOUS: true }
	},
	ARTICLES: {
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

const commentsElement = document.getElementById('comments')
// Generate Comment section (starts with dummy comment)
commentsElement.innerHTML = generatehtmlforcomment({
	comment: {
		_id: null,
		text: 'Comment Section:',
		accountID: null,
		articleID: document.getElementById('article-header').dataset.articleId,
		parentCommentID: null
	},
	authorizedDelete: false,
	authorizedCreate: false,
	authorizedRemove: false,
	authorizedFlag: false,
	authorizedVote: false
});
// Listen for Click events on Comments section
commentsElement.addEventListener('click', function(event) {
	const commentElement = event.target.closest('.comment') //Get comment element clicked...
	// Toggles visibility of child Comments (and associated functionality)
	// If no children exist will query for 1st page of child comments.
	if(event.target.classList.contains('replies-toggle')) {
		// comment -> p -> footer -> first
		var loadNew = commentElement.lastElementChild.firstElementChild.nextElementSibling.nextElementSibling
		var replies = loadNew.nextElementSibling
		var loadOld = replies.nextElementSibling
		var replyToggle = loadOld.nextElementSibling
		var create = replyToggle.nextElementSibling
		// Does not work.. depth-first-search
		// var loadNew = commentElement.querySelector('.load-newer:first-child');
		// var replies = commentElement.querySelector('.replies:first-child');
		// var loadOld = commentElement.querySelector('.load-older:last-child');
		// var replyToggle = commentElement.querySelector('.reply-toggle:last-child');
		// var create = commentElement.querySelector('.create:last-child');
		if(event.target.textContent == 'Hide Replies') {
			event.target.textContent = 'Show Replies';
			loadNew.classList.add('hidden')
			replies.classList.add('hidden')
			loadOld.classList.add('hidden')
			if(!create.classList.contains('hidden')) { // If create visibile
				replyToggle.click()
			}
			replyToggle.classList.add('hidden')
		}
		else {
			event.target.textContent = 'Hide Replies';
			loadNew.classList.remove('hidden')
			replies.classList.remove('hidden')
			loadOld.classList.remove('hidden')
			if(IDENTITY_ACCESS_MANAGMENT_LIST.COMMENTS.CREATE[getVisitorType()]) {
				replyToggle.classList.remove('hidden')
			}
			if(replies.childNodes.length === 0) { //Try loading comments if none exit
				loadComments({parentCommentElement: commentElement, newOrOldComments: 'OLD' })
			}
		}
	}
	// Toggles Visibility of Create new Comment Form.
	if(event.target.classList.contains('reply-toggle')) {
		// var create = commentElement.querySelector('footer > .create');
		var create = commentElement.lastElementChild.lastElementChild
		if(event.target.innerHTML === 'Reply') {
			event.target.innerHTML = 'Cancel'
			create.classList.remove('hidden')
		}
		else {
			event.target.innerHTML = 'Reply'
			create.classList.add('hidden')
		}
	}
	// AJAX request to Delete comment
	if(event.target.classList.contains('delete')) {
		const client = new XMLHttpRequest();
		client.onreadystatechange = function() {
			if (this.readyState === XMLHttpRequest.DONE) {
				const response = JSON.parse(this.response);
				if(this.status === 200) {
					commentElement.remove()
				}
				else {
					handleServerErrorResponse('Delete Comment Failed.', response)
				}
			}
		}
		client.open('POST', '/comments/delete');
		client.setRequestHeader("Content-Type", "application/json");
		var data = {}
		data._id = commentElement.dataset.id || null;
		client.send(JSON.stringify(data));
	}
	// AJAX request to Delete comment
	if(event.target.classList.contains('remove')) {
		const client = new XMLHttpRequest();
		client.onreadystatechange = function() {
			if (this.readyState === XMLHttpRequest.DONE) {
				const response = JSON.parse(this.response);
				if(this.status === 200) {
					commentElement.firstElementChild.innerHTML = '~~Comment has been Removed~~'
				}
				else {
					handleServerErrorResponse('Remove Comment Failed.', response)
				}
			}
		}
		client.open('POST', '/comments/remove');
		client.setRequestHeader("Content-Type", "application/json");
		var data = {}
		data._id = commentElement.dataset.id || null;
		client.send(JSON.stringify(data));
	}
	// AJAX request to Delete comment
	if(event.target.classList.contains('flag')) {
		const client = new XMLHttpRequest();
		client.onreadystatechange = function() {
			if (this.readyState === XMLHttpRequest.DONE) {
				const response = JSON.parse(this.response);
				if(this.status === 200) {
				}
				else {
					handleServerErrorResponse('Flag Comment Failed.', response)
				}
			}
		}
		client.open('POST', '/comments/flag');
		client.setRequestHeader("Content-Type", "application/json");
		var data = {}
		data._id = commentElement.dataset.id || null;
		client.send(JSON.stringify(data));
	}
	if(event.target.classList.contains('up-vote')) {
		const client = new XMLHttpRequest();
		client.onreadystatechange = function() {
			if (this.readyState === XMLHttpRequest.DONE) {
				const response = JSON.parse(this.response);
				if(this.status === 200) {
				}
				else {
					handleServerErrorResponse('Up-Vote Comment Failed.', response)
				}
			}
		}
		client.open('POST', '/comments/incrementUpVoteCount');
		client.setRequestHeader("Content-Type", "application/json");
		var data = {}
		data._id = commentElement.dataset.id || null;
		client.send(JSON.stringify(data));
	}
	if(event.target.classList.contains('down-vote')) {
		const client = new XMLHttpRequest();
		client.onreadystatechange = function() {
			if (this.readyState === XMLHttpRequest.DONE) {
				const response = JSON.parse(this.response);
				if(this.status === 200) {
				}
				else {
					handleServerErrorResponse('Down-vote Comment Failed.', response)
				}
			}
		}
		client.open('POST', '/comments/incrementDownVoteCount');
		client.setRequestHeader("Content-Type", "application/json");
		var data = {}
		data._id = commentElement.dataset.id || null;
		client.send(JSON.stringify(data));
	}
	if(event.target.classList.contains('load-newer')) {
		loadComments({parentCommentElement: commentElement, newOrOldComments: 'NEW' })
	}
	if(event.target.classList.contains('load-older')) {
		loadComments({parentCommentElement: commentElement, newOrOldComments: 'OLD'})
	}
});
// Listen for Submit events on Comments sections (create comment form)
commentsElement.addEventListener('submit', function(event) {
	const commentElement = event.target.closest('.comment')
	if(event.target.classList.contains('create')) {
		var repliesToggle = commentElement.lastElementChild.firstElementChild.nextElementSibling
		var loadNew = repliesToggle.nextElementSibling
		var replies = loadNew.nextElementSibling
		var loadOld = replies.nextElementSibling
		var replyToggle = loadOld.nextElementSibling
		var create = replyToggle.nextElementSibling
		event.preventDefault();
		const client = new XMLHttpRequest();
		client.onreadystatechange = function() {
			if (this.readyState === XMLHttpRequest.DONE) {
				const response = JSON.parse(this.response);
				if(this.status === 200) {
					// Programmatically click load latest comments... if initial comment load exists
					// Otherwise programmatically click show comments...
					if(replies.childNodes.length === 0){
						repliesToggle.click();
						repliesToggle.click();
					}
					else 
						loadNew.click();

				}
				else {
					handleServerErrorResponse('Create Comment Failed.', response)
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
document.getElementById('login-form').addEventListener('submit', function(event) {
	event.preventDefault();
	const httpClient = new XMLHttpRequest();
	httpClient.open('POST', '/auth/local/token');
	httpClient.setRequestHeader("Content-Type", "application/json");
	httpClient.onreadystatechange = function() {
		if (this.readyState === XMLHttpRequest.DONE) {
			const response = JSON.parse(this.response);
			if(this.status === 200) {
				window.location.href = '/';
			}
			else {
				handleServerErrorResponse('Login Failed.', response)
			}
		}
	}
	const jsonData = {}
	for(var i = 0; i < event.target.length - 1; i++) {
		jsonData[event.target.elements[i].name] = event.target.elements[i].value;
	}
	httpClient.send(JSON.stringify(jsonData));
})
document.getElementById('register-form').addEventListener('submit', function(event) {
	event.preventDefault();
	const httpClient = new XMLHttpRequest();
	httpClient.open('POST', '/auth/local/register');
	httpClient.setRequestHeader("Content-Type", "application/json");
	httpClient.onreadystatechange = function() {
		if (this.readyState === XMLHttpRequest.DONE) {
			const response = JSON.parse(this.response);
			if(this.status === 200) {
				window.location.href = '/';
			}
			else {
				handleServerErrorResponse('Registeration Failed.', response)
			}
		}
	}
	const jsonData = {}
	for(var i = 0; i < event.target.length - 1; i++) {
		jsonData[event.target.elements[i].name] = event.target.elements[i].value;
	}
	httpClient.send(JSON.stringify(jsonData));
})
document.getElementById('logout').addEventListener('click', function(event) {
	event.preventDefault();
	const client = new XMLHttpRequest();
	client.onreadystatechange = function() {
		if (this.readyState === XMLHttpRequest.DONE) {
			if(this.status === 200) {
				window.location.href = '/'
			}
			else {
				handleServerErrorResponse('Logout Failed.', response)
			}
		}
	}
	client.open('POST', '/auth/local/logout');
	client.send();
})
function loadComments({parentCommentElement, newOrOldComments='OLD' }={}) {
	var repliesElement = parentCommentElement.querySelector('.replies')
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
	query.pageSize = PAGE_SIZE
	query.articleID = document.getElementById('article-header').dataset.articleId || null;
	query.parentCommentID = parentCommentElement.dataset.id || null;
	const queryString = JSON.stringify(query);
	const encodedQuery = encodeURIComponent(queryString);
	const client = new XMLHttpRequest();
	client.onreadystatechange = function() {
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
					repliesElement.dataset.skipOnPage = (comments.length < PAGE_SIZE) ? comments.length : 0
					repliesElement.dataset.pageNum = (comments.length < PAGE_SIZE) ? query.pageNum : query.pageNum+1
					insertMethod = 'beforeend'
				}
				for(var i = 0; i < comments.length; i++) {
					const commentHtml = generatehtmlforcomment({
						comment: comments[i],
						authorizedDelete: IDENTITY_ACCESS_MANAGMENT_LIST.COMMENTS.DELETE_OWN[getVisitorType()],
						authorizedCreate: IDENTITY_ACCESS_MANAGMENT_LIST.COMMENTS.CREATE[getVisitorType()],
						authorizedRemove: IDENTITY_ACCESS_MANAGMENT_LIST.COMMENTS.REMOVE_OWN[getVisitorType()] && comments[i].accountID == getCurrentUser()._id,
						authorizedFlag: IDENTITY_ACCESS_MANAGMENT_LIST.COMMENTS.FLAG[getVisitorType()],
						authorizedVote: IDENTITY_ACCESS_MANAGMENT_LIST.COMMENTS.VOTE[getVisitorType()]
					});
					repliesElement.insertAdjacentHTML(insertMethod, commentHtml)
				}
			}
			else {
				alert('Error getting comments. '+this.status +' - '+this.statusText+'. '+response.message);
			}
		}
	}
	client.open('GET', '/comments/read?data='+encodedQuery);
	client.send();
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
	return JSON.parse(user.slice(2,user.length)) //Removes additional character prepended to cookie from express-middleware (for some odd reason)
}
function getCookie(name) {
	var cookie = Cookie.parse(document.cookie);
	return cookie[name];
}
function handleServerErrorResponse(message, response) {
	alert(message+'.. '+response.status +' - '+response.statusText+' ('+response.message+')');
}