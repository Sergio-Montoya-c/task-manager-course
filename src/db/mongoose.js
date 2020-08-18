const mongoose = require('mongoose')

mongoose.connect(`${process.env.HOST}${process.env.DATABASE}`, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true
})
