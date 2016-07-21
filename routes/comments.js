var express = require('express');
var comments = require('../model/comments');
var router = express.Router();

/* GET Comments listing. */
router.get('/createComment', function(req, res, next) {
	console.log("Received Request: Create Comment");
	comments.createComment(req.body, function(err, doc) {
		if(err == undefined)
			res.json(docs);
	});
});
router.get('/getChildCommentsForParent', function(req, res, next) {
	console.log("Received Request:  Child Comments for Parent");
	comments.getChildCommentsForParent(req.body, function(err, docs) {
		if(err == undefined)
			res.json(docs);
	});
});
router.get('/getChildCommentsForEntity', function(req, res, next) {
	console.log("Received Request: Child Comments for Entity");
	comments.getChildCommentsForEntity(req.body, function(err, docs) {
		if(err == undefined)
			res.json(docs);
	});
});
router.get('/getAllComments', function(req, res, next) {
	console.log("Received Request: Child Comments");
	comments.getAllComments(function(err, docs) {
		if(err == undefined)
			res.json(docs);
	});
});
module.exports = router;
