const exp = require('express') ;
const User = require('../models/User.js') ;
const bc = require('bcryptjs') ;
const multer = require('multer') ;
const sharp = require('sharp') ;

const auth = require('../src/auth.js') ;
const { sendWelcomeMail, sendGoodbyeMail } = require('../src/emails/account.js') ;

const router = new exp.Router() ;

const upload = multer({
    // dest: 'images/dp',
    limits: {
        fileSize: 2000000
    },
    fileFilter( req, file, cb){
        if(file.originalname.endsWith('.jpg') || file.originalname.endsWith('.jpeg') || file.originalname.endsWith('.png'))
            cb(undefined, true) ;            
        else
            cb(new Error('File Uploaded is not an Image'))
    }
})

//UPLOAD END_POINTS
router.post('/users/me/upload', auth, upload.single('upload'), (req, res) => {

    sharp(req.file.buffer).resize({ width:400, height: 400}).png().toBuffer()
    .then( buffer => {
        req.user.image = buffer
        return req.user.save()
    })
    .then( () => res.json("Image Uploaded Successfully") )
    .catch( err => res.status(500).json(err)) ;
    
}, (error, req, res, next) => {
    res.status(400).json({ error: error.message}) ;
}) ;

router.get('/users/:id/image', (req, res) => {
    
    User.findById(req.params.id)
    .then( data => {
        if(!data || !data.image)
            res.status(404).json('User or Image not found') ;

        res.set('Content-Type', 'image/png');
        res.send(data.image) ;
    })
    .catch( e => res.status(400).send(e) );
})


router.delete('/users/me/upload', auth, (req, res) => {
    req.user.image = undefined ;
    
    req.user.save()
    .then( () => res.json("Image Deleted Successfully") )
    .catch( err => res.status(400).json(err)) ;

}) ;

//Comment while upload
// router.get('/users', (req, res) => {

// 	User.find({})
// 	.then(users => res.json(users))
// 	.catch(err => res.status(404).json(err)) ;
// }) ;

//ACTUAL END_POINTS
router.post('/users', (req, res) => {
    const {name, age, email, password} = req.body ;
    let user = {} ;

    const insertObj = {
        name, age, email, 
        password : bc.hashSync(password, 2)
    };
	
    const userr = new User(insertObj); 
	
	userr.save()
	.then( data => {
        sendWelcomeMail(data.name, data.email) ;
        user = data ;
        return userr.generateAuthToken() ;
    })
    .then( token => {
        res.status(201).json({token, user}); 
    })
	.catch( err => res.status(400).json(err) ) ;
} ) ;

router.get('/users/me', auth, (req, res) => {
    res.json(req.user) ;
}) ;

router.delete('/users/me', auth, (req, res) => {
    console.log('User delete Requested')

    req.user.remove()
    .then(user => {
        res.json(user) ;
        sendGoodbyeMail(user.name, user.email) ;
    })
    .catch(err => res.status(500).json(err) ) ;
}) ;

router.patch('/users/me', auth, (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'password', 'age']
    const isValidOperation = updates.every( update => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }

    updates.forEach( update => req.user[update] = req.body[update]) ;

    req.user.save()
    .then( data => res.json(data))
    .catch( err => res.status(500).json(err)) ;
})

module.exports = router
