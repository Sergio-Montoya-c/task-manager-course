const request = require('supertest')
const app = require('../src/app')
const Task = require('../src/models/task')

const {
  validUser,
  userTwo,
  taskOne,
  setupDatabase
} =  require('./fixtures/db')

beforeEach(setupDatabase)

test('Should create a task for a user', async () => {
  const response = await request(app)
    .post('/tasks')
    .set('Authorization', `Bearer ${validUser.tokens[0].token}`)
    .send({
      description: 'New task from test suite'
    })
    .expect(201)

  const task = await Task.findById(response.body._id)
  expect(task).not.toBeNull()
  expect(task.completed).toBe(false)
})

test('User should get only owned tasks', async () => {
  const response = await request(app)
    .get('/tasks')
    .set('Authorization', `Bearer ${validUser.tokens[0].token}`)
    .send()
    .expect(200)

  expect(response.body).toHaveLength(2)
})

test('User should not delete others tasks', async () => {
  await request(app)
    .delete(`/tasks/${taskOne._id}`)
    .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
    .send()
    .expect(404)

  const task = await Task.findById(taskOne._id)
  expect(task).not.toBeNull()
})