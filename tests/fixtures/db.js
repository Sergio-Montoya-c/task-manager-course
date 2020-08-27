const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const User = require('../../src/models/user')
const Task = require('../../src/models/task')

const validUserId = new mongoose.Types.ObjectId
const validUser = {
  _id: validUserId,
  name: 'Sergio',
  email: 'sergio@test.io',
  password: 'Orange13!',
  tokens: [{
    token: jwt.sign({ _id: validUserId}, process.env.JWT_SECRET)
  }]
}

const userTwoId = new mongoose.Types.ObjectId
const userTwo = {
  _id: userTwoId,
  name: 'User Two Name',
  email: 'user-two@test.io',
  password: 'MyPassTwo13!',
  tokens: [{
    token: jwt.sign({ _id: userTwoId}, process.env.JWT_SECRET)
  }]
}

const taskOne = {
  _id: new mongoose.Types.ObjectId,
  description: 'Task One Description',
  completed: false,
  owner: validUserId
}

const taskTwo = {
  _id: new mongoose.Types.ObjectId,
  description: 'Task Two Description',
  completed: true,
  owner: validUserId
}

const taskThree = {
  _id: new mongoose.Types.ObjectId,
  description: 'Task Three Description',
  completed: true,
  owner: userTwoId
}

const setupDatabase = async () => {
  await User.deleteMany()
  await Task.deleteMany()
  await new User(validUser).save()
  await new User(userTwo).save()
  await new Task(taskOne).save()
  await new Task(taskTwo).save()
  await new Task(taskThree).save()
}

module.exports = {
  validUser,
  validUserId,
  setupDatabase,
  userTwo,
  taskOne,
  taskTwo,
  taskThree
}