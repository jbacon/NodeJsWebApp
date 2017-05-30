var mongoUtil = require('../common/mongoUtil');
var mongodb = require('mongodb');

class Comment {
	constructor(comment) {
		// Use Set methods to perform validation
		// Set Default/Initial values
		this._id = comment._id;
		this.name = comment.name;
		this.text = comment.text;
		this.articleID = comment.articleID;
		this.parentCommentID = comment.parentCommentID;
		if(comment.upVoteCount)
			this.upVoteCount = comment.upVoteCount
		else
			this.upVoteCount = 0
		if(comment.downVoteCount)
			this.downVoteCount = comment.downVoteCount
		else
			this.downVoteCount = 0
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
		if(typeof(newName) === 'string')
			this._name = newName;
		else
			throw new Error('Failed to construct comment. Invalid entry for... newName: '+newName)
	}
	get text() {
		return this._text;
	}
	set text(newText) {
		if(typeof(newText) === 'string')
			this._text = newText;
		else
			throw new Error('Failed to construct comment. Invalid entry for... newText: '+newText)
	}
	get articleID() {
		return this._articleID;
	}
	set articleID(newArticleID) {
		if(typeof(newArticleID) === 'string')
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
	get upVoteCount() {
		return this._upVoteCount;
	}
	set upVoteCount(newUpVoteCount) {
		if(typeof(newUpVoteCount) === 'number')
			this._upVoteCount = newUpVoteCount;
		else
			throw new Error('Failed to construct comment. Invalid entry for... newUpVoteCount: '+newUpVoteCount)
	}
	get downVoteCount() {
		return this._downVoteCount;
	}
	set downVoteCount(newDownVoteCount) {
		if(typeof(newDownVoteCount) === 'number')
			this._downVoteCount = newDownVoteCount;
		else
			throw new Error('Failed to construct comment. Invalid entry for... newDownVoteCount: '+newDownVoteCount)
	}
	incrementUpVote() {
		this.upVoteCount = this.upVoteCount + 1;
	}
	incrementDownVote() {
		this.downVoteCount = this.downVoteCount + 1;
	}
	toObject() {
		return {
			_id: this._id, 
			name: this.name,
			text: this.text,
			articleID: this.articleID,
			parentCommentID: this.parentCommentID,
			upVoteCount: this.upVoteCount,
			downVoteCount: this.downVoteCount
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
exports.getComments = function({ articleID, parentCommentID, _id=undefined, pageSize=10, pageNum=1 } = {}, callback) {
	var query = {}
	query.articleID = articleID
	query.parentCommentID = parentCommentID
	if(_id) 			
		query._id = _id
	mongoUtil.getDocumentsPaginated(
		{ 
			collection: 'comments', 
			query: query,
			pageSize: pageSize,
			pageNum: pageNum
		},
		function(err, results) {
			callback(err, results)
		}
	);
}
exports.deleteComment = function({ _id } = {}, callback) {
	mongoUtil.deleteDocument(
		{ 
			collection: 'comments', 
			documentID: new mongodb.ObjectID(_id)
		},
		function(err, results) {
			callback(err, results)
		}
	);
}
exports.incrementDownVoteCount = function({ _id } = {}, callback) {
	mongoUtil.getDocumentsPaginated(
		{ 
			collection: 'comments', 
			query: {
				_id: _id
			},
			pageSize: 1,
			pageNum: 1
		},
		function(err, results) {
			try {
				var commentClass = new Comment(results[0]);
				commentClass.incrementDownVote()
				mongoUtil.updateDocument(
					{ 
						collection: 'comments', 
						document: commentClass.toObject()
					},
					function(err, result) {
						callback(err, result)
					}
				);
			}
			catch(err) {
				callback(err)
			}
		}
	);
}
exports.incrementUpVoteCount = function({ _id } = {}, callback) {
	// Get comment from Mongo
	mongoUtil.getDocumentsPaginated(
		{ 
			collection: 'comments', 
			query: {
				_id: _id
			},
			pageSize: 1,
			pageNum: 1
		},
		function(err, results) {
			// Try Increment Comment UpVote count
			try {
				var commentClass = new Comment(results[0]);
				commentClass.incrementUpVote()
				// Update Comment in Mongo
				mongoUtil.updateDocument(
					{ 
						collection: 'comments', 
						document: commentClass.toObject()
					},
					function(err, result) {
						callback(err, result)
					}
				);
			}
			catch(err) {
				callback(err)
			}
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