var express = require('express');
var comments = require('../model/comments');
var router = express.Router();

/* GET Comments listing. */
router.post('/createComment', function(req, res, next) {
	console.log("Received Request: Create Comment");
	comments.createComment(req.body, function(err, results) {
		if(err) {
			console.log(err);
			res.status(500).json({ error: err });
		}
		else {
			res.json({ data: results.ops });
		}
	});
});
router.get('/getComments', function(req, res, next) {
	console.log("Received Request: getComments(" + JSON.stringify(req.query)+")");
	comments.getComments(
		req.query,
		function(err, docs) {
			if(err) {
				console.log(err);
				res.status(500).json({ error: err})
			} else {
				res.json({ data: docs });
			}
		}
	);
});
router.post('/deleteComment', function(req, res, next) {
	console.log("Received Request: deleteComment(" + JSON.stringify(req.query) + ")");
	comments.deleteComment(
		req.body,
		function(err, results) {
			if(err){
				console.log(err);
				res.status(500).json({ error: err });
			}
			else {
				res.json({ data: results.ops });
			}
		}
	);
});
module.exports = router;
