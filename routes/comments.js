var express = require('express');
var comments = require('../model/comments');
var router = express.Router();

/* GET Comments listing. */
router.post('/createComment', function(req, res, next) {
	console.log("Received Request: createComment. req.body=" + JSON.stringify(req.body)+")");
	comments.createComment(
		req.body,
		function(err, comment) {
			if(err) {
				console.log(err);
				res.status(500).json({ error: err });
			}
			else {
				res.json({ data: comment });
			}
	});
});
router.get('/getComments', function(req, res, next) {
	console.log("Received Request: getComments. req.body=" + JSON.stringify(req.query)+")");
	comments.getComments(
		req.query,
		function(err, comments) {
			if(err) {
				console.log(err);
				res.status(500).json({ error: err})
			} 
			else {
				res.json({ data: comments });
			}
		}
	);
});
router.post('/deleteComment', function(req, res, next) {
	console.log("Received Request: deleteComment. req.body=" + JSON.stringify(req.body) + ")");
	comments.deleteComment(
		req.body,
		function(err, result) {
			if(err){
				console.log(err);
				res.status(500).json({ error: err });
			}
			else {
				res.json({ data: result });
			}
		}
	);
});
router.post('/updateComment', function(req, res, next) {
	console.log("Received Request: updateComment. req.body=" + JSON.stringify(req.body) + ")");
	comments.deleteComment(
		req.body,
		function(err, result) {
			if(err){
				console.log(err);
				res.status(500).json({ error: err });
			}
			else {
				res.end()
			}
		}
	);
});
router.post('/incrementUpVoteCount', function(req, res, next) {
	console.log("Received Request: incrementUpVoteCount. req.body=" + JSON.stringify(req.body) + ")");
	comments.incrementUpVoteCount(
		req.body,
		function(err, result) {
			if(err){
				console.log(err);
				res.status(500).json({ error: err });
			}
			else {
				res.end()
			}
		}
	);
});
router.post('/incrementDownVoteCount', function(req, res, next) {
	console.log("Received Request: incrementDownVoteCount. req.body=" + JSON.stringify(req.body) + ")");
	comments.incrementDownVoteCount(
		req.body,
		function(err, result) {
			if(err){
				console.log(err);
				res.status(500).json({ error: err });
			}
			else {
				res.end()
			}
		}
	);
});
module.exports = router;
