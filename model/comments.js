var mongoUtil = require('../common/mongoUtil');
var mongodb = require('mongodb');

class Comment {
	constructor(comment) {
		this._id = comment._id;
		this.name = comment.name;
		this.text = comment.text;
		this.articleID = comment.articleID;
		this.parentCommentID = comment.parentCommentID;
	}
	get _id() {
		return this.__id;
	}
	set _id(newID) {
		if(!newID || mongodb.ObjectID.isValid(newID))
			this.__id = newID;
		else
			throw new Error('Failed to construct comment. Invalid entry for... newID: '+newID)
	}
	get name() {
		return this._name;
	}
	set name(newName) {
		if(newName)
			this._name = newName;
		else
			throw new Error('Failed to construct comment. Invalid entry for... newName: '+newName)
	}
	get text() {
		return this._text;
	}
	set text(newText) {
		if(newText)
			this._text = newText;
		else
			throw new Error('Failed to construct comment. Invalid entry for... newText: '+newText)
	}
	get articleID() {
		return this._articleID;
	}
	set articleID(newArticleID) {
		if(newArticleID)
			this._articleID = newArticleID;
		else
			throw new Error('Failed to construct comment. Invalid entry for... newArticleID: '+newArticleID)
	}
	get parentCommentID() {
		return this._parentCommentID;
	}
	set parentCommentID(newParentCommentID) {
		if(!newParentCommentID || mongodb.ObjectID.isValid(newParentCommentID))
			this._parentCommentID = newParentCommentID;
		else
			throw new Error('Failed to construct comment. Invalid entry for... newParentCommentID: '+newParentCommentID)
	}
	toObject() {
		return {
			_id: this._id, 
			name: this.name,
			text: this.text,
			articleID: this.articleID,
			parentCommentID: this.parentCommentID
		}
	}
	toJsonString() {
		return JSON.stringify(this.toObject())
	}
}
exports.createComment = function({ comment } = {}, callback) 
{
	try {
		var commentClass = new Comment(comment);
		mongoUtil.createDocument(
			{ 
				collection: 'comments', 
				document: commentClass.toObject()
			},
			function(err, results) {
				callback(err, results.ops[0])
			}
		);
	}
	catch(err) {
		callback(err)
	}
}
exports.getComments = function({ articleID=undefined, commentID=undefined, parentCommentID=undefined, pageSize=10, pageNum=1 } = {}, callback) {
	query = {}
	if(articleID)
		query.articleID = articleID
	if(commentID)
		query.commentID = commentID
	if(parentCommentID)
		query.parentCommentID = parentCommentID
	mongoUtil.getDocumentsPaginated(
		{ 
			collection: 'comments', 
			query: query,
			pageSize: pageSize,
			pageNum: pageNum,
		},
		function(err, results) {
			callback(err, results)
		}
	);
}
exports.deleteComment = function({ commentID } = {}, callback) {
	mongoUtil.deleteDocument(
		{ 
			collection: 'comments', 
			documentID: new mongodb.ObjectID(commentID)
		},
		function(err, results) {
			callback(err, results)
		}
	);
}
exports.updateComment = function({ comment } = {}, callback) {
	try {
		var commentClass = new Comment(comment);
		mongoUtil.updateDocument(
			{ 
				collection: 'comments', 
				document: commentClass.toObject()
			},
			function(err, results) {
				callback(err, results)
			}
		);
	}
	catch(err) {
		callback(err)
	}
}