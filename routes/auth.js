var express = require('express');
var authUtil = require('../common/authUtil');
var Account = require('../model/accounts');
var bcrypt = require('bcryptjs');
var router = express.Router();

router.post('/local/login', 
	authUtil.getPassport().authenticate([ 'local' ]),
	(req, res, next) => {
		// Authentication Successfully
		res.end();
	}
);
router.post('/local/logout', (req, res, next) => {
	req.logout()
	res.end();
});
router.post('/local/register', function(req, res, next) {
	// 1. Register Account (Local Strategy)
	// 2. Signin Account
	// Signup (Indicates Local strategy)
	// Registeration is automated for Other strategies
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

module.exports = router;