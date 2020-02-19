const mongoose = require('mongoose') ;
const valid = require('validator') ;

// Direct way of creating Collection(Table)
// DO NOT REMOVE COMMENTS
// const Task = mongoose.model('Task', {
// 	descr: {
// 		type: String ,
// 		required: true,
// 		trim: true,
// 	},
// 	complete: {
// 		type: Boolean,
// 		default: false
// 	},
// 	creator: {
// 		type: mongoose.Schema.Types.ObjectId,
// 		required: true,
// 		ref: 'User'
// 	}
// }) ;

const TaskSchema = mongoose.Schema({
	descr: {
		type: String ,
		required: true,
		trim: true,
	},
	complete: {
		type: Boolean,
		default: false
	},
	creator: {
		type: mongoose.Schema.Types.ObjectId,
		required: true,
		ref: 'User'
	}
}, {
	timestamps: true
}) ;

const Task = mongoose.model('Task', TaskSchema) ;

module.exports = Task ;