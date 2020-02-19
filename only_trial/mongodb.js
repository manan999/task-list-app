const mongodb = require('mongodb') ;

const Mongo = mongodb.MongoClient ;

const connectionURL = 'mongodb://127.0.0.1:27017' ;
const dbName = 'task-app' ;

// Mongo.connect(connectionURL, { useNewUrlParser: true}, (error, client) => {
// 	if(error)
// 		return console.log('An Error Occured while connecting to database') ;

// 	const db = client.db(dbName) ;

// 	db.collection('task').insertMany([
// 		{
// 			descr: 'Lets create a react app',
// 			completed: false
// 		},
// 		{	descr: 'Chhole bhi banane hai',
// 			completed: false
// 		}
// 		], (error, result) => {
// 			if(error)
// 				return console.log('Unable to insert documents') ;

// 			console.log(result.ops) ;
// 		}) ;
// }) ;

Mongo.connect(connectionURL, { useNewUrlParser: true})
.then( client => {
	const db = client.db(dbName) ;

	// db.collection('task').insertMany([
	// 	{
	// 		descr: 'Lets create a mobile app',
	// 		complete: 'No'
	// 	},
	// 	{	descr: 'Rajma bhi banane hai',
	// 		complete: 'Yes'
	// 	}
	// ])
	// .then( result => console.log(result.ops))
	// .catch( err => console.log(err)) ;

	// db.collection('task').updateMany({
	// 	complete: 'No',
	// },
	// {
	// 	$set: {
	// 		complete: 'Yes',
	// 	}
	// })
	// .then( result => console.log(result.ops))
	// .catch( err => console.log(err)) ;

	db.collection('task').deleteMany({
		complete: 'Yes',
	})
	.then( result => console.log(result.deletedCount))
	.catch( err => console.log(err)) ;
})
.catch( err => console.log(err))