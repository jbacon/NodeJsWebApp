var express = require('express');
var authUtil = require('../common/authUtil');
var Account = require('../model/accounts');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var config = require('../config.json');
var router = express.Router();

router.post('/local/login', 
	authUtil.getPassport().authenticate(
		[ 'local-session' ], 
		{ session: true }),
		(req, res, next) => {
			// Send Cookie User and End Resquest
	        res.cookie(
	        	'loggedInUser',
	        	{
	        		_id: req.user._id,
	        		nameLast: req.user.nameLast,
	        		nameFirst: req.user.nameFirst,
	        		email: req.user.email
	        	}, 
	        	{ httpOnly: false });
			res.clearCookie('JWT'); //Clear cookie
			res.end();
	}
);
router.get('/facebook', 
	authUtil.getPassport().authenticate('facebook')
);
router.get('/facebook/callback', 
	authUtil.getPassport().authenticate('facebook'),
	function(req, res, next) {
		// Successful authentication!
		res.end();
	}
);
router.post('/local/logout', (req, res, next) => {
	res.clearCookie('loggedInUser');
	res.clearCookie('JWT');
	res.end();
});
router.post('/local/register', (req, res, next) => {
	// Generate Hash and Create Account
	try {
		req.body.passwordHashAndSalt = bcrypt.hashSync(req.body.password, 10);
		req.body.password = undefined
		var account = new Account(req.body)
		Account.create({ account: account })
			.then((results) => {
				res.json({ data: results });
			})
			.catch((err) => {
				next(err)
			});
	}
	catch(err) {
		next(err)
	}
});
router.post('/local/token', (req, res, next) => {
	// Generate JWT and send to Client...
	Account.read(
		{
			query: {
			  email: req.body.email
			}
		})
		.then((results) => {
			if(results.length > 0 && bcrypt.compareSync(req.body.password, results[0].passwordHashAndSalt)) {
				var token = jwt.sign(
					results[0],
					config.jwtSecret,
					{
						algorithm: 'HS256',
						expiresIn: '1h'
					});
				res.cookie(
		        	'loggedInUser',
		        	{
		        		_id: results[0]._id,
		        		nameLast: results[0].nameLast,
		        		nameFirst: results[0].nameFirst,
		        		email: results[0].email
		        	}, 
		        	{ httpOnly: false }
		        	);
				res.cookie(
		        	'JWT',
		        	token, 
		        	{ httpOnly: true }
		        	);
				res.set('Authorization', 'Bearer '+token)
				res.json({ token: token, user: req.user })
			}
			else if(results.length > 0) {
				var error = new Error('Password incorrect.')
			    error.status = 401
			    next(error)
			}
			else {
				var error = new Error('Account not found.')
				error.status = 404
			    next(error)
			}
		})
		.catch((err) => {
			next(err)
		});
});
module.exports = router;