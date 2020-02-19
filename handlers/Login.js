const exp = require('express') ;
const User = require('../models/User.js') ;
const bc = require('bcryptjs') ;
const auth = require('../src/auth.js') ;

const router = new exp.Router() ;

router.post('/login', (req, res) => {
	const {email, password} = req.body ;

	let user = {} ;

	//findByEmail is a self-created function in User Schema
	User.findByEmail(email, password)
	.then(userr => {
		user = userr ;
		return userr.generateAuthToken() ;
	})
	.then(token => {
		const obj = { token, user} ;
		res.json(obj); 
	})
	.catch(err => {
		console.log(err) ;
		res.status(400).json(err) ;
	}) ;
}) ;

router.post('/logout', auth, (req, res) => {
	req.user.tokens = req.user.tokens.filter( (token) => token.token !== req.token) ;
	req.user.save()
	.then( data => res.json('Successfully logged out') )
	.catch( err => res.status(500).json(err)) ;
}) ;

router.post('/logoutAll', auth, (req, res) => {
	req.user.tokens = [] ;
	req.user.save()
	.then( data => res.json('Successfully logged out') )
	.catch( err => res.status(500).json(err)) ;
}) ;

module.exports = router ;
