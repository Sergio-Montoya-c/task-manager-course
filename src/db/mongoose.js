const mongoose = require('mongoose')

mongoose.connect(`${process.env.HOST}`, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true
})
