var mongoUtil = require('../common/mongoUtil');
var authUtil = require('../common/authUtil');
var Document = require('../model/document');
var validator = require('validator');
var bcrypt = require('bcryptjs');
var mongodb = require('mongodb');

module.exports = class Account extends Document{
	static get COLLECTION_NAME() {
		return 'accounts'
	}
	constructor(account) {
		super(account);
		this.email = account.email;
		this.nameFirst = account.nameFirst;
		this.nameLast = account.nameLast;
		this.passwordHashAndSalt = account.passwordHashAndSalt;
	}
	get email() {
		return this._email;
	}
	set email(newEmail) {
		if(validator.isEmail(newEmail))
			this._email = validator.normalizeEmail(newEmail);
		else
			throw new Error('Failed to construct account. Invalid entry for... newEmail: '+newEmail)
	}
	get isAdmin() {
		if(this._email === 'jbacon@zagmail.gonzaga.edu')
			return true
		else
			return false
	}
	get nameFirst() {
		return this._nameFirst;
	}
	set nameFirst(newNameFirst) {
		if(validator.isAlpha(newNameFirst))
			this._nameFirst = newNameFirst;
		else
			throw new Error('Failed to construct account. Invalid entry for... newNameFirst: '+newNameFirst)
	}
	get nameLast() {
		return this._nameLast;
	}
	set nameLast(newNameLast) {
		if(validator.isAlpha(newNameLast))
			this._nameLast = newNameLast;
		else
			throw new Error('Failed to construct account. Invalid entry for... newNameLast: '+newNameLast)
	}
	get passwordHashAndSalt() {
		return this._passwordHashAndSalt;
	}
	set passwordHashAndSalt(newPasswordHashAndSalt) {
		if(typeof(newPasswordHashAndSalt) === 'string') {
			this._passwordHashAndSalt = newPasswordHashAndSalt;
		}
		else
			throw new Error('Failed to construct account. Invalid entry for... newPasswordHashAndSalt')
	}
	toObject() {
		var obj = super.toObject()
		obj.email = this.email;
		obj.isAdmin = this.isAdmin;
		obj.nameFirst = this.nameFirst;
		obj.nameLast = this.nameLast;
		obj.passwordHashAndSalt = this.passwordHashAndSalt;
		return obj
	}
	static async create({ account } = {}) {
		if(!(account instanceof Account)) 
			throw new Error('Failed to create account. Parameter not instance of Article')
		return await super.create({ 
			doc: account
		})
	}
	static async read({ query={}, pageSize=10, pageNum=1 } = {}) {
		var docs = await super.read( {
			query: query,
			collection: Account.COLLECTION_NAME,
			pageSize: pageSize,
			pageNum: pageNum
		});
		return docs;
	}
	static async update({ account } = {}) {
		if(!(account instanceof Account))
			throw new Error('Failed to create account. Parameter not instance of Article')
		return await super.update({
			doc: account
		});
	}
	static async delete({ _id } = {}) {
		return await super.delete( {
			_id: _id,
			collection: Account.COLLECTION_NAME
		});
	}
}