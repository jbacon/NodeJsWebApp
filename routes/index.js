var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
	console.log("Received Request: Get Home Page.");
	res.render('index', { title: 'Welcome!' });
});

module.exports = router;
