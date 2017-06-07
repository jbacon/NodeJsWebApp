var mongoUtil = require('../common/mongoUtil');
var validator = require('validator');
var mongodb = require('mongodb');

module.exports = class Document {
	constructor(doc) {
		// Use Set methods to perform validation
		// Set Default/Initial values
		this._id = doc._id;
		this.dateUpdated = doc.dateUpdated
		this.dateCreated = doc.dateCreated
	}
	get _id() {
		return this.__id;
	}
	set _id(newID) {
		if(newID === null || newID === undefined) {
			this.__id = new mongodb.ObjectID();
		}
		else if(mongodb.ObjectID.isValid(newID)) {
			var objectID = mongodb.ObjectID(newID)
			this.__id = objectID;
		}
		else if(newID instanceof mongodb.ObjectID) {
			this.__id = newID;
		}
		else {
			throw new Error('Failed to construct document. Invalid entry for... newID: '+newID)
		}
	}
	get dateUpdated() {
		return this._name;
	}
	set dateUpdated(newDateUpdated) {
		if(newDateUpdated === null || newDateUpdated === undefined) {
			this._dateUpdated = new Date
		}
		else if(newDateUpdated instanceof Date)
			this._dateUpdated = newDateUpdated;
		else
			throw new Error('Failed to construct document. Invalid entry for... newDateUpdated: '+newDateUpdated)
	}
	get dateCreated() {
		return this._dateCreated;
	}
	set dateCreated(newDateCreated) {
		if(newDateCreated === null || newDateCreated === undefined) {
			this._dateCreated = new Date
		}
		else if(newDateCreated instanceof Date)
			this._dateCreated = newDateCreated;
		else
			throw new Error('Failed to construct document. Invalid entry for... newDateCreated: '+newDateCreated)
	}
	/* This enforces use of get methods for creating Object.
		Otherwise "_" instance variables would be used.
		Object to be stored in Mongo. */
	toObject() {
		var obj = {}
		obj._id = this._id;
		obj.dateUpdated = this.dateUpdated;
		obj.dateCreated = this.dateCreated;
		return obj
	}
	static async create({ doc } = {}) {
		if(!(doc instanceof Document))
			throw new Error('Failed to create document. Parameter not instance of Document')
		return await mongoUtil.getDB()
			.collection(doc.constructor.COLLECTION_NAME)
			.insertOne(doc.toObject())
	}
	static async delete({ _id, collection } = {}) {
		var objectID = new mongodb.ObjectID(_id);
		return await mongoUtil.getDB()
			.collection(collection)
			.deleteOne( { _id: objectID });
	}
	static async update({ doc } = {}) {
		if(!(doc instanceof Document))
			throw new Error('Invalid document')
		return await mongoUtil.getDB()
			.collection(doc.constructor.COLLECTION_NAME)
			.updateOne(doc.toObject())
	}
	static async read({ query={}, collection, pageSize=10, pageNum=1 } = {}) {
		var docs = await mongoUtil.getDB()
			.collection(collection)
			.find(query)
			.skip(parseInt(pageSize) * (parseInt(pageNum) - 1))
			.limit(parseInt(pageSize))
			.toArray();
		return docs
	}
}