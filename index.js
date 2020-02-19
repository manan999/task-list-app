const exp = require('express') ;
require('./src/Mongoose.js') ;
const userHandler = require('./handlers/User.js') ;
const taskHandler = require('./handlers/Task.js') ;
const loginHandler = require('./handlers/Login.js') ;

//To connect to atlas database use CONN_STRING as DB_URL

const app = exp() ;

app.use(exp.json()) ;
app.use(userHandler) ;
app.use(taskHandler) ;
app.use(loginHandler) ;

app.get('/', (req, res) => {
	console.log(req.body) ;
	console.log(req.headers) ;
	console.log(req.params) ;
	console.log(req.url) ;
	res.json("Please give the required endpoint for json data") ;
}) ;

app.listen(process.env.PORT, () => {
	console.log("Server is Online" ) ;
}) ;