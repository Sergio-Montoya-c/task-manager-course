const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const Task = require('../models/task')

const userSchema = mongoose.Schema({
  name: {
    type:  String,
    required: true,
    trim: true,
  },
  password:  {
    type: String,
    required: true,
    minlength: 7,
    trim: true,
    validate(value) {
      if (value.toLowerCase().includes('password')) throw new Error('Password can not contains the word password')
    }
  },
  email: {
    type: String,
    required: Boolean,
    trim: true,
    lowercase: true,
    unique: true,
    validate(value) {
      if (!validator.isEmail(value)) throw new Error('Email is invalid')
    }
  },
  age: {
    type: Number,
    default: 0,
    validate(value) {
      if (value < 0) throw new Error('Age must be a positive number')
    }
  },
  tokens: [{
    token: {
      type: String,
      required: true
    }
  }],
  avatar: {
    type: Buffer
  }
}, {
  timestamps: true
})

// Hash password before saving
userSchema.pre('save', async function(next) {
  const user = this
  if (user.isModified('password')) user.password = await bcrypt.hash(user.password, 8)
  next()
})

// Delete tasks when user is removed
userSchema.pre('remove', async function(next) {
  const user = this
  await Task.deleteMany({ owner: user._id })
  next()
})

// Custom functions for User
userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email })

  // Throw error if no user found
  if (!user) throw new Error('Unable to login')

  const isMatch = await bcrypt.compare(password, user.password)

  // Throw error if password doesn't match
  if (!isMatch) throw new Error('Unable to login')

  return user
}

userSchema.methods.generateAuthToken = async function() {
  const user = this

  const token = jwt.sign({
    _id: user.id.toString()
  }, process.env.JWT_SECRET)
  user.tokens = user.tokens.concat({ token })
  await user.save()

  return token
}

userSchema.methods.toJSON = function() {
  const user = this
  const userObject = user.toObject()

  delete userObject.password
  delete userObject.tokens
  delete userObject.avatar

  return userObject
}

// Set relationship between models
userSchema.virtual('tasks', {
  ref: 'Task',
  localField: '_id',
  foreignField: 'owner'
})

const User = mongoose.model('User', userSchema)




module.exports = User