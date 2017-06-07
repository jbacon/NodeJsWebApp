var express = require('express');
var Role = require('../model/roles');
var router = express.Router();

router.post('/create', function(req, res, next) {
	model.create(
		req.body, 
		function(err, results) {
			if(err) {
				next(err)
			}
			else {
				res.json({ data: results });
			}
		}
	);
});
router.get('/get', function(req, res, next) {
	model.get(
		req.query,
		function(err, results) {
			if(err) {
				next(err)
			} else {
				res.json({ data: results });
			}
		}
	);
});
router.post('/delete', function(req, res, next) {
	model.delete(
		req.body,
		function(err, results) {
			if(err){
				next(err)
			}
			else {
				res.end()
			}
		}
	);
});
router.post('/update', function(req, res, next) {
	model.update(
		req.body,
		function(err, results) {
			if(err){
				next(err)
			}
			else {
				res.end()
			}
		}
	);
});

module.exports = router;