var express = require('express');
var comments = require('../model/comments');
var router = express.Router();

/* GET Comments listing. */
router.post('/createComment', function(req, res, next) {
	console.log("Received Request: Create Comment");
	comments.createComment(req.body, function(err, doc) {
		if(err) {
			console.log(err);
			res.status(500).json({ error: err });
		}
		else {
			if(next) {
				next(req, res);
			}
			else {
				res.json({ data: doc });
			}
		}
	});
});
router.get('/getChildCommentsForParent', function(req, res, next) {
	console.log("Received Request:  Child Comments for Parent");
	comments.getChildCommentsForParent(req.body, function(err, docs) {
		if(err){
			console.log(err);
			res.status(500).json({ error: err});
		}
		else {
			res.json({ data: docs });
		}
	});
});
router.get('/getChildCommentsForEntity', function(req, res, next) {
	console.log("Received Request: Child Comments for Entity");
	comments.getChildCommentsForEntity(req.body, function(err, docs) {
		if(err) {
			console.log(err);
			res.status(500).json({ error: err});
		}
		else {
			res.json({ data: docs });
		}
	});
});
router.get('/getComments', function(req, res, next) {
	console.log("Received Request: Get All Comments");
	comments.getComments(function(err, docs) {
		if(err == undefined) {
			res.json({ data: docs });
		} else {
			console.log(err);
			res.status(500).json({ error: err})
		}
	});

});
module.exports = router;
