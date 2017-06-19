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
	toObject() {
		var obj = super.toObject()
		obj.accountID = this.accountID;
		obj.text = this.text;
		obj.articleID = this.articleID;
		obj.parentCommentID = this.parentCommentID;
		obj.upVoteCount = this.upVoteCount;
		obj.downVoteCount = this.downVoteCount;
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
	static async read({ query={}, pageSize=10, pageNum=1, skipOnPage=0 } = {}) {
		/* Build simple query.  */
		if(mongodb.ObjectID.isValid(query.articleID))
			query.articleID = new mongodb.ObjectID(query.articleID);
		else
			query.articleID = null;
		if(mongodb.ObjectID.isValid(query.parentCommentID))
			query.parentCommentID = new mongodb.ObjectID(query.parentCommentID);
		else 
			query.parentCommentID = null;
		var results = await super.read({
			query: query,
			collection: Comment.COLLECTION_NAME,
			pageSize: pageSize,
			pageNum: pageNum
		});
		return results
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
}