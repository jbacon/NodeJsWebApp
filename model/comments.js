var mongoUtil = require('../common/mongoUtil');
var Document = require('../model/document');
var validator = require('validator');
var mongodb = require('mongodb');

module.exports = class Comment extends Document {
	static get COLLECTION_NAME() {
		return 'comments'
	}
	constructor(comment) {
		// Use Set methods to perform validation
		// Set Default/Initial values
		super(comment);
		this.accountID = comment.accountID;
		this.text = comment.text;
		this.articleID = comment.articleID;
		this.parentCommentID = comment.parentCommentID
		this.upVoteCount = comment.upVoteCount
		this.downVoteCount = comment.downVoteCount
		this.flags = comment.flags
		this.removed = comment.removed
	}
	get accountID() {
		return this._accountID;
	}
	set accountID(newAccountID) {
		if(newAccountID === undefined || newAccountID === null) {
			this._accountID = null;
		}
		else if(mongodb.ObjectID.isValid(newAccountID)) {
			var objectID = mongodb.ObjectID(newAccountID)
			this._accountID = objectID;
		}
		else {
			throw new Error('Invalid entry for accountID: '+newAccountID)
		}
	}
	get text() {
		return this._text;
	}
	set text(newText) {
		if(newText === undefined || newText === null) {
			this._text = null;
		}
		else if(typeof(newText) === 'string') {
			this._text = newText;
		}
		else {
			throw new Error('Invalid entry for text: '+newText)
		}
	}
	get articleID() {
		return this._articleID;
	}
	set articleID(newArticleID) {
		if(newArticleID === undefined || newArticleID === '' || newArticleID === null) {
			this._articleID = null;
		}
		else if(mongodb.ObjectID.isValid(newArticleID)) {
			var objectID = mongodb.ObjectID(newArticleID)
			this._articleID = objectID;
		}
		else {
			throw new Error('Invalid entry for articleID: '+newArticleID)
		}
	}
	get parentCommentID() {
		return this._parentCommentID;
	}
	set parentCommentID(newParentCommentID) {
		if(newParentCommentID === undefined || newParentCommentID === '' || newParentCommentID === null) {
			this._parentCommentID = null;
		}
		else if(mongodb.ObjectID.isValid(newParentCommentID)) {
			var objectID = mongodb.ObjectID(newParentCommentID)
			this._parentCommentID = objectID;
		}
		else {
			throw new Error('Invalid entry for parentCommentID: '+newParentCommentID)
		}
	}
	get upVoteCount() {
		return this._upVoteCount;
	}
	set upVoteCount(newUpVoteCount) {
		if(newUpVoteCount === null || newUpVoteCount === undefined || newUpVoteCount === '')
			this._upVoteCount = 0;
		else if(typeof(newUpVoteCount) === 'number')
			this._upVoteCount = newUpVoteCount;
		else
			throw new Error('Invalid entry for newUpVoteCount: '+newUpVoteCount)
	}
	get downVoteCount() {
		return this._downVoteCount;
	}
	set downVoteCount(newDownVoteCount) {
		if(newDownVoteCount === null || newDownVoteCount === undefined || newDownVoteCount === '')
			this._downVoteCount = 0;
		else if(typeof(newDownVoteCount) === 'number')
			this._downVoteCount = newDownVoteCount;
		else
			throw new Error('Invalid entry for... newDownVoteCount: '+newDownVoteCount)
	}
	get flags() {
		return this._flags;
	}
	set flags(newFlags) {
		if(newFlags === null || newFlags === undefined || newFlags === '')
			this._flags = 0;
		else if(typeof(newFlags) === 'number')
			this._flags = newFlags;
		else
			throw new Error('Invalid entry for... newFlags: '+newFlags)
	}
	get removed() {
		return this._removed;
	}
	set removed(newRemoved) {
		if(newRemoved === null || newRemoved === undefined || newRemoved === '')
			this._removed = false;
		else if(typeof(newRemoved) === 'boolean')
			this._removed = newRemoved;
		else
			throw new Error('Invalid entry for... newRemoved: '+newRemoved)
	}
	toObject() {
		var obj = super.toObject()
		obj.accountID = this.accountID;
		obj.text = this.text;
		obj.articleID = this.articleID;
		obj.parentCommentID = this.parentCommentID;
		obj.upVoteCount = this.upVoteCount;
		obj.downVoteCount = this.downVoteCount;
		obj.flags = this.flags;
		obj.removed = this.removed;
		return obj
	}
	static async create({ comment } = {}) {
		if(!(comment instanceof Comment))
			throw new Error('Parameter not instance of Comment')
		var results = await super.create({
			doc: comment
		})
		return results
	}
	// Supports pagination via either skip/limit or find/limit (https://scalegrid.io/blog/fast-paging-with-mongodb/)
	static async read({ articleID=undefined, parentCommentID=undefined, startID=undefined, pageSize=10, sortOrder=-1/*Ascending*/, pageNum=1, skipOnPage=0 } = {}) {
		var match = {}
		if(articleID && mongodb.ObjectID.isValid(articleID))
			match.articleID = mongodb.ObjectID(articleID);
		else
			match.articleID = null;
		if(parentCommentID && mongodb.ObjectID.isValid(parentCommentID))
			match.parentCommentID = mongodb.ObjectID(parentCommentID);
		else
			match.parentCommentID = null;
		if(startID && mongodb.ObjectID.isValid(startID)){
			if(sortOrder === -1) //Descending
				match._id = { $lt: mongodb.ObjectID(startID) };
			else if(sortOrder === 1) //Ascending
				match._id = { $gt: mongodb.ObjectID(startID) };
		}
		else{
			if(sortOrder === -1) //Descending
				match._id = { $lt: mongodb.ObjectID() };
			else if(sortOrder === 1) //Ascending
				match._id = { $gt: mongodb.ObjectID() };
		}
		var results = await mongoUtil.getDB()
			.collection(Comment.COLLECTION_NAME)
			.aggregate([])
			.match(match)
			.sort({
				_id: sortOrder
			})
			.skip(parseInt(pageSize) * (parseInt(pageNum) - 1))
			.limit(parseInt(pageSize))
			.lookup({
				from: 'accounts',
				localField: 'accountID',
				foreignField: '_id',
				as: 'lookup_account'
			})
			.toArray();
		return results.slice(skipOnPage) //Skip On Page
	}
	static async update({ comment } = {}) {
		if(!(comment instanceof Comment))
			throw new Error('Failed to create document. Parameter not instance of Comment')
		var results = await super.update({
			doc: comment
		})
		return results;
	}
	static async delete({ _id } = {}) {
		var results = await super.delete( {
			_id: _id,
			collection: Comment.COLLECTION_NAME
		});
		return results
	}
	static async incrementDownVoteCount({ _id } = {}) {
		var objectID = new mongodb.ObjectID(_id);
		return await mongoUtil.getDB()
			.collection(Comment.COLLECTION_NAME).updateOne(
				{
					_id: objectID 
				},
				{
					$inc: {
						downVoteCount: 1
					}
				}
			);
	}
	static async incrementUpVoteCount({ _id } = {}) {
		var objectID = new mongodb.ObjectID(_id);
		return await mongoUtil.getDB()
			.collection(Comment.COLLECTION_NAME).updateOne(
				{
					_id: objectID 
				},
				{
					$inc: {
						upVoteCount: 1
					}
				}
			);
	}
	static async flag({ _id } = {}) {
		var objectID = new mongodb.ObjectID(_id);
		return await mongoUtil.getDB()
			.collection(Comment.COLLECTION_NAME).updateOne(
				{
					_id: objectID 
				},
				{
					$inc: {
						flags: 1
					}
				}
			);
	}
	static async remove({ _id } = {}) {
		var objectID = new mongodb.ObjectID(_id);
		return await mongoUtil.getDB()
			.collection(Comment.COLLECTION_NAME).updateOne(
				{
					_id: objectID
				},
				{
					$set: { removed: true }
				}
			);
	}
}