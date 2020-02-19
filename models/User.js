const mongoose = require('mongoose') ;
const valid = require('validator') ;
const bc = require('bcryptjs') ;
const jwt = require('jsonwebtoken') ;
const Task = require('./Task.js') ;

const UserSchema = new mongoose.Schema({
	name: {
		type: String,
		trim: true,
		required: true
	},
	age: {
		type: Number,
		validate(age) {
			if(age < 0)
				throw new Error('Age must be a positive number') ;
		}
	},
	email: {
		type: String,
		trim: true,
		unique: true,
		required: true,
		lowercase: true,
		validate(email) {
			if(!valid.isEmail(email))
				throw new Error('Invalid E-Mail Address') ;
		}
	},
	password : {
		type: String,
		trim: true,
		required: true,
		minlength: 6,
		validate(password) {
			if( password.includes('password'))
				throw new Error('This password may be too common try some other')
		}
	},
	tokens: [{
		token: {
			type: String, 
			required: true 
		}
	}],
	image: {
		type: Buffer,
	}
}, { 
	timestamps: true
}) ;

UserSchema.virtual('tasks', {
	ref: 'Task',
	localField: '_id',
	foreignField: 'creator'
}) ;

UserSchema.statics.findByEmail = async function(email, password){
	const user = await User.findOne( {email} )
	// Same as
	// User.findOne( {email: email})
	if(!user)
		throw new Error("User with this Email does not exist") ;
	else
	{
		const isMatch = bc.compareSync(password, user.password) ;
		if(!isMatch)
			throw new Error("Password does not match") ;
		else
			return user ;
	}
}

UserSchema.methods.generateAuthToken = function(){
	const token = jwt.sign({_id: this._id.toString()}, process.env.JWT_SECRET) ;
	this.tokens = this.tokens.concat({ token }) ;
	this.save() ;
	return token ;
}

//Comment this method while debugging
UserSchema.methods.toJSON = function(){
	let obj = this.toObject() ;

	delete obj.password ;
	delete obj.tokens ;
	delete obj.image ;

	return obj ;
}

//Function below will delete user tasks before he is removed
UserSchema.pre('remove', function(next){
	
	Task.deleteMany({creator: this._id})
	.then(data => console.log(data))
	.catch(err => console.log(err)) ;
	next() ;
	
})

const User = mongoose.model('User', UserSchema) ;

module.exports = User ;