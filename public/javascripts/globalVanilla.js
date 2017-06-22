import Cookie from 'cookie'

const ADMIN_EMAIL = 'jbacon@zagmail.gonzaga.edu'

const PAGE_SIZE=5

// Prevents flickering of unstyled U.I. (where styling is programmatic)
document.body.classList.remove('hidden')

const commentsElement = document.getElementById('comments')

// Generate Comment section (starts with dummy comment)
commentsElement.insertAdjacentHTML('beforeend', generatehtmlforcomment({
	comment: {
		id: 'null',
		text: 'Comment Section:',
		accountID: 'null',
		articleID: document.getElementById('article-header').dataset.articleId,
		parentCommentID: 'null',
		childCommentIDs: [ 'dummy-comment' ]
	},
	currentUser: getCurrentUser()
}));

// Listen for Click events on Comments section
commentsElement.addEventListener('click', function(event) {
	const commentElement = event.target.closest('.comment') //Get comment element clicked...
	
	// Toggles visibility of child Comments (and associated functionality)
	// If no children exist will query for 1st page of child comments.
	if(event.target.classList.contains('replies-toggle')) {
		if(event.target.textContent == 'Hide Replies') {
			event.target.textContent = 'Show Replies';
			commentElement.querySelector(':scope > * > * > .load-newer').classList.add('hidden')
			commentElement.querySelector(':scope > * > .replies').classList.add('hidden')
			commentElement.querySelector(':scope > * > .load-older').classList.add('hidden')
			if(!commentElement.querySelector(':scope > * > .create').classList.contains('hidden')) { // If create visibile
				commentElement.querySelector(':scope > * > * > .reply-toggle').click()
			}
		}
		else {
			event.target.textContent = 'Hide Replies';
			commentElement.querySelector(':scope > * > * > .load-newer').classList.remove('hidden')
			commentElement.querySelector(':scope > * > .replies').classList.remove('hidden')
			commentElement.querySelector(':scope > * > .load-older').classList.remove('hidden')
			if(commentElement.querySelector(':scope > * > .replies').childNodes.length === 0) { //Try loading comments if none exit
				loadChildComments({parentCommentElement: commentElement, newOrOldComments: 'OLD' })
			}
		}
	}
	// Toggles Visibility of Create new Comment Form.
	if(event.target.classList.contains('reply-toggle')) {
		if(event.target.innerHTML === 'Reply') {
			event.target.innerHTML = 'Cancel'
			commentElement.querySelector(':scope > * > .create').classList.remove('hidden')
		}
		else {
			event.target.innerHTML = 'Reply'
			commentElement.querySelector(':scope > * > .create').classList.add('hidden')
		}
	}
	// AJAX request to Delete comment
	// if(event.target.classList.contains('delete')) {
	// 	const client = new XMLHttpRequest();
	// 	client.onreadystatechange = function() {
	// 		if (this.readyState === XMLHttpRequest.DONE) {
	// 			const response = JSON.parse(this.response);
	// 			if(this.status === 200) {
	// 				commentElement.remove()
	// 			}
	// 			else {
	// 				handleServerErrorResponse('Delete Comment Failed.', response)
	// 			}
	// 		}
	// 	}
	// 	client.open('POST', '/comments/delete');
	// 	client.setRequestHeader("Content-Type", "application/json");
	// 	var data = {}
	// 	data._id = commentElement.dataset.id || null;
	// 	client.send(JSON.stringify(data));
	// }
	// AJAX request to Remove comment (hide text)
	if(event.target.classList.contains('remove')) {
		const client = new XMLHttpRequest();
		client.onreadystatechange = function() {
			if (this.readyState === XMLHttpRequest.DONE) {
				const response = JSON.parse(this.response);
				if(this.status === 200) {
					commentElement.firstElementChild.innerHTML = '~~Comment has been Removed~~'
					commentElement.querySelector(':scope > * > * > .replies-toggle').classList.add('hidden')
					commentElement.querySelector(':scope > * > * > .reply-toggle').classList.add('hidden')
					commentElement.querySelector(':scope > * > * > .up-vote-count').classList.add('hidden')
					commentElement.querySelector(':scope > * > * > .up-vote').classList.add('hidden')
					commentElement.querySelector(':scope > * > * > .down-vote-count').classList.add('hidden')
					commentElement.querySelector(':scope > * > * > .down-vote').classList.add('hidden')
					commentElement.querySelector(':scope > * > * > .remove').classList.add('hidden')
					commentElement.querySelector(':scope > * > * > .flag').classList.add('hidden')
					commentElement.querySelector(':scope > * > * > .load-newer').classList.add('hidden')
					commentElement.querySelector(':scope > * > .replies').classList.add('hidden')
					commentElement.querySelector(':scope > * > .load-older').classList.add('hidden')
					commentElement.querySelector(':scope > * > .create').classList.add('hidden')
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
	// AJAX request to Flag comment
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
		loadChildComments({parentCommentElement: commentElement, newOrOldComments: 'NEW' })
	}
	if(event.target.classList.contains('load-older')) {
		loadChildComments({parentCommentElement: commentElement, newOrOldComments: 'OLD'})
	}
});
// Listen for Submit events on Comments sections (create comment form)
commentsElement.addEventListener('submit', function(event) {
	const commentElement = event.target.closest('.comment')
	if(event.target.classList.contains('create')) {
		event.preventDefault();
		const client = new XMLHttpRequest();
		client.onreadystatechange = function() {
			if (this.readyState === XMLHttpRequest.DONE) {
				const response = JSON.parse(this.response);
				if(this.status === 200) {
					// If initial comment, unhide 'Show Comments' and click 'Show Comments'
					// Otherwise Programmatically click load latest comments...
					if(commentElement.querySelector(':scope > * > .replies').childNodes.length === 0){
						commentElement.querySelector(':scope > * > * > .replies-toggle').classList.remove('hidden');
						commentElement.querySelector(':scope > * > * > .replies-toggle').click();
					}
					else {
						commentElement.querySelector(':scope > * > * > .load-newer').click();
					}

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
function loadChildComments({parentCommentElement, newOrOldComments='OLD' }={}) {
	var repliesElement = parentCommentElement.querySelector('.replies')
	const query = {}

	if(newOrOldComments === 'OLD') { 
		// Start is set to initial load's first comment (not necessariliy first comment)
		query.start = repliesElement.dataset.start //either 'newest' or some id
		query.sortOrder = -1
		query.pageNum = Number(repliesElement.dataset.pageNum || 1)
		query.skipOnPage = Number(repliesElement.dataset.skipOnPage || 0)
	}
	else if(newOrOldComments === 'NEW') { 
		// StartID is set to most recent comment (first child element)
		query.start = repliesElement.firstElementChild.dataset.id
		query.sortOrder = 1
		query.pageNum = 1
	}
	query.pageSize = PAGE_SIZE
	query.articleID = parentCommentElement.dataset.articleId
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
					// 'newest' indicates initial load of comments... save the start comment ID to data attribute
					if(repliesElement.dataset.start == 'newest' && comments.length > 0) {
						repliesElement.dataset.start = comments[0]._id
					}
					// Update skipOnPage
					repliesElement.dataset.skipOnPage = ((comments.length + query.skipOnPage) < PAGE_SIZE) ? query.skipOnPage + comments.length : 0
					repliesElement.dataset.pageNum = ((comments.length + query.skipOnPage) < PAGE_SIZE) ? query.pageNum : query.pageNum+1
					insertMethod = 'beforeend'
				}
				for(var i = 0; i < comments.length; i++) {
					const commentHtml = generatehtmlforcomment({
						comment: comments[i],
						currentUser: getCurrentUser()
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