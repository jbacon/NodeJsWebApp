var mongoUtil = require('../common/mongoUtil');
var authUtil = require('../common/authUtil');
var Document = require('../model/document');
var validator = require('validator');
var bcrypt = require('bcryptjs');
var mongodb = require('mongodb');

class Role extends Document{
	static get COLLECTION_NAME() {
		return 'roles'
	}
	constructor(role) {
		super(role);
	}
	static async create({ role } = {}) {
		if(!(role instanceof Role)) 
			throw new Error('Invalid role. Not instance of Role')
		return await super.create({ 
			doc: role
		})
	}
	static async update({ role } = {}) {
		if(!(role instanceof Role))
			throw new Error('Invalid role. Not instance of Role')
		return await super.update({
			doc: role
		});
	}
}