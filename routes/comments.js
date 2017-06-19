var express = require('express');
var Comment = require('../model/comments');
var mongodb = require('mongodb'); 
var commonAuth = require('../common/authUtil.js'); 
var router = express.Router();
var express = require('express');

router.post('/create', commonAuth.isAuthenticated, function(req, res, next) {
	try {
		var comment = new Comment(req.body)
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
		})
});
router.post('/delete', commonAuth.isAuthenticated, function(req, res, next) {
	Comment.delete(req.body)
		.then((results) => {
			res.json({ data: results });
		})
		.catch((err) => {
			next(err)
		})
});
router.post('/update', commonAuth.isAuthenticated, function(req, res, next) {
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
router.post('/incrementUpVoteCount', function(req, res, next) {
	Comment.incrementUpVoteCount(req.body)
		.then((results) => {
			res.json({ data: results });
		})
		.catch((err) => {
			next(err)
		})
});
router.post('/incrementDownVoteCount', function(req, res, next) {
	Comment.incrementDownVoteCount(req.body)
		.then((results) => {
			res.json({ data: results });
		})
		.catch((err) => {
			next(err)
		})
});

module.exports = router;