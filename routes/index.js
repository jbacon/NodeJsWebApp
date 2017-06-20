var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('index', { 
		title: 'Josh Bacon - Portfolio', 
		user: req.cookies.loggedInUser
	});
});

module.exports = router;