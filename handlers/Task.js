const exp = require('express') ;
const Task = require('../models/Task.js') ;

const auth = require('../src/auth.js') ;

const router = new exp.Router() ;

//Comment while upload
router.get('/tasks', (req, res) => {
	Task.find({})
	.then(tasks => res.json(tasks))
	.catch(err => res.status(404).json(err)) ;
}) ;

router.get('/tasks/me', auth, (req, res) => {
    const {complete, limit, skip, sortBy, sortType} = req.query ;
    let match = {} ;
    let sort = {} ;

    if (complete)
        match.complete = (complete === 'true') ;
    
    if( sortBy && sortType)
        sort[sortBy] = parseInt(sortType) ; 
    
    req.user.populate({
        path: 'tasks',
        match,
        options: {
            limit : parseInt(limit),
            skip  : parseInt(skip),
            sort
        }  
    }).execPopulate()
    .then( () => res.json(req.user.tasks))
    .catch(err => res.status(404).json(err)) ;
}) ;

router.get('/tasks/:id', auth, (req, res) => {
    const _id = req.params.id ;

    Task.findOne({_id, creator: req.user._id})
    .then(tasks => {
    	if(!tasks)
            res.status(404).send('task(s) not found')
    	else
            res.json(tasks)
    })
    .catch(err => res.status(500).json(err)) ;
})

router.post('/tasks', auth, (req, res) => {
	const task = new Task({
        ...req.body,
        creator: req.user._id
    }); 
	
	task.save()
	.then( data => res.status(201).json(data) )
	.catch( err => res.status(400).json(err) ) ;
} ) ;

router.delete('/tasks/:id', auth, (req, res) => {
    Task.findOneAndDelete({ _id: req.params.id, creator: req.user._id})
    .then(task => {
        if (!task) 
            res.status(404).send('task(s) not found')
        else
        	res.json("Deleted Succesfully")
    })
    .catch(err => res.status(500).json(err) ) ;
})

router.patch('/tasks/:id', auth, (req, res) => {
    const updates          = Object.keys(req.body)
    const allowedUpdates   = ['descr', 'complete']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }

    Task.findOne({ _id: req.params.id, creator: req.user._id})
    .then(task => {
        if (!task) 
            res.status(404).json('task(s) not found')
        else
        {
            updates.forEach( update => task[update] = req.body[update]) ;
            task.save() ; 
            res.json(task) ;     
        }
    })
    .catch( err => res.status(500).json(err)) ;
})

module.exports = router
