// const mongoose = require('mongoose') ;
// const valid = require('validator') ;

mongoose.connect('mongodb://127.0.0.1:27017/task-manager-app', {
	useNewUrlParser: true,
	useCreateIndex: true
})

const User = mongoose.model('User', {
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
	}
}) ;

const me = new User({
	name: 'Lalit',
	email: '9lalitkumar9@gmail.com' ,
	age: 21
})

me.save()
.then( () => console.log(me) )
.catch( err => console.log(err) ) ;

const Task = mongoose.model('Task', {
	descr: {
		type: String
		required: true,
		trim: true,
	},
	complete: {
		type: Boolean,
		default: false
	}
}) ;

// const tsk = new Task({
// 	descr: 'Water your garden',
// 	complete: false
// })

// tsk.save()
// .then( () => console.log(tsk) )
// .catch( err => console.log(err) ) ;