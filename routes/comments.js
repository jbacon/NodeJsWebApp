var express = require('express');
var comments = require('../model/comments');
var router = express.Router();

/* GET Comments listing. */
router.post('/createComment', function(req, res, next) {
	console.log("Received Request: createComment(" + JSON.stringify(req.body)+")");
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
	console.log("Received Request: getComments(" + JSON.stringify(req.query)+")");
	comments.getComments(
		req.query,
		function(err, comments) {
			if(err) {
				console.log(err);
				res.status(500).json({ error: err})
			} else {
				res.json({ data: comments });
			}
		}
	);
});
router.post('/deleteComment', function(req, res, next) {
	console.log("Received Request: deleteComment(" + JSON.stringify(req.body) + ")");
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
	console.log("Received Request: updateComment(" + JSON.stringify(req.body) + ")");
	comments.deleteComment(
		req.body,
		function(err, comment) {
			if(err){
				console.log(err);
				res.status(500).json({ error: err });
			}
			else {
				res.json({ data: comment });
			}
		}
	);
});
module.expor
module.exports = router;
