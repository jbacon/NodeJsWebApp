var express = require('express');
var articles = require('../model/articles');
var router = express.Router();

router.post('/createArticle', function(req, res, next) {
	console.log("Received Request: createArticle(" + JSON.stringify(req.body)+")");
	articles.createArticle(req.body, function(err, results) {
		if(err) {
			console.log(err);
			res.status(500).json({ error: err });
		}
		else {
			res.json({ data: results.ops });
		}
	});
});
router.get('/getArticles', function(req, res, next) {
	console.log("Received Request: getArticles(" + JSON.stringify(req.query)+")");
	articles.getArticles(
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
router.post('/deleteArticle', function(req, res, next) {
	console.log("Received Request: deleteArticle(" + JSON.stringify(req.query) + ")");
	articles.deleteArticle(
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
