var express = require('express');
var Comment = require('../model/comments');
var mongodb = require('mongodb'); 
var commonAuth = require('../common/authUtil.js'); 
var router = express.Router();
var express = require('express');

// Route Handler
router.post('/create', commonAuth.isAuthenticated, function(req, res, next) {
	try {
		var comment = new Comment(req.body)
		// Associate current user's account w/ comment
		comment.accountID = new mongodb.ObjectID(req.user._id);
		Comment.create({ comment: comment })
			.then((results) => {
				res.json({ data: results.ops[0] });
			})
			.catch((err) => {
				next(err)
			})
	}
	catch(err) {
		next(err)
	}
});
router.get('/read', function(req, res, next) {
	const data = JSON.parse(req.query.data)
	Comment.read(data)
		.then((results) => {
			res.json({ data: results });
		})
		.catch((err) => {
			next(err)
		});
});
router.post('/delete', commonAuth.isAuthenticated, commonAuth.isAdmin, function(req, res, next) {
	Comment.delete(req.body)
		.then((results) => {
			res.json({ data: results });
		})
		.catch((err) => {
			next(err)
		})
});
router.post('/update', commonAuth.isAuthenticated, commonAuth.isAdmin, function(req, res, next) {
	try {
		var comment = new Comment(req.body)
		Comment.update({comment: comment })
			.then((results) => {
				res.json({ data: results });
			})
			.catch((err) => {
				next(err)
			})
	}
	catch(err) {
		next(err)
	}
});
router.post('/incrementUpVoteCount', commonAuth.isAuthenticated, function(req, res, next) {
	Comment.incrementUpVoteCount(req.body)
		.then((results) => {
			res.json({ data: results });
		})
		.catch((err) => {
			next(err)
		})
});
router.post('/incrementDownVoteCount', commonAuth.isAuthenticated, function(req, res, next) {
	Comment.incrementDownVoteCount(req.body)
		.then((results) => {
			res.json({ data: results });
		})
		.catch((err) => {
			next(err)
		})
});
router.post('/flag', function(req, res, next) {
	Comment.flag(req.body)
		.then((results) => {
			res.json({ data: results });
		})
		.catch((err) => {
			next(err)
		})
});
router.post('/remove', commonAuth.isAuthenticated, function(req, res, next) {
	// Check if Admin and/or User owns comment before allowing removal...
	commonAuth.isAdmin(req, res, function(error) {
		if(error) { // Not Admin, check if user owns comment
			Comment.read({ id: req.body._id, pageSize: 1, pageNum: 1 })
			.then((results) => { 
				if(results.length === 0) { // Comment not found
					var err = new Error('This comment does not exist anymore...')
					err.status = 404
					next(err)
				}
				else if(results[0].accountID.toString() === req.user._id) {
					Comment.remove(req.body)
						.then((results) => {
							res.json({ data: results });
						})
						.catch((err) => {
							next(err)
						});
				}
				else { //User does not own this comment...
					var err = new Error('Not permited to remove comment owned by another user...')
					err.status = 401
					next(err)
				}
			})
			.catch((err) => {
				next(err)
			});
		}
		else { // Permission to remove comment (admin access)
			Comment.remove(req.body)
				.then((results) => {
					res.json({ data: results });
				})
				.catch((err) => {
					next(err)
				});
		}
	});
});

module.exports = router;