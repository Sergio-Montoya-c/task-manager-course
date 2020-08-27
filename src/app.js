const express = require('express')
require('./db/mongoose')
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')
const filesRouter = require('./routers/files')

const app = express()

app.use(express.json())

// Routes declaration
app.use(userRouter)
app.use(taskRouter)
app.use(filesRouter)

module.exports = app