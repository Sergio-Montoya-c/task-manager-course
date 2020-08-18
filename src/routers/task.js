const express = require('express')
const router = express.Router()
const task = require('../controllers/tasks')

// Middleware
const auth = require('../middleware/auth')

router.get('/tasks', auth, task.all)
router.get('/tasks/:id', auth, task.find)
router.patch('/tasks/:id', auth, task.update)
router.delete('/tasks/:id', auth, task.remove)
router.post('/tasks', auth, task.create)

module.exports = router