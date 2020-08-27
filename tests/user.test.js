const request = require('supertest')
const app = require('../src/app')
const User = require('../src/models/user')
const {validUser, validUserId, setupDatabase} =  require('./fixtures/db')

beforeEach(setupDatabase)

test('Should sign up a new User',  async () => {
  const response = await request(app).post('/users').send({
    name: 'Sergio',
    email: 'sergio@example-test.io',
    password: 'Orange13!',
  }).expect(201)

  // Assert datbase did added the user
  const user = await User.findById(response.body.user._id)
  expect(user).not.toBeNull()

  // Assert response contains desired information
  expect(response.body).toMatchObject({
    user: {
      name: 'Sergio',
      email: 'sergio@example-test.io',
    },
    token: user.tokens[0].token
  })

  // Make sure password is not stored as plain text
  expect(user.password).not.toBe('Orange13!')

})

test('Should not be able to Signup without name', async () => {
  const { body: {_message}} = await request(app)
    .post('/users')
    .send({
      email: 'sergio@michelada.io',
      password: 'MyPass123!'
    })
    .expect(400)

  expect(_message).toBe('User validation failed')
})

test('Should not be able to Signup without email', async () => {
  const { body: {_message}} = await request(app)
    .post('/users')
    .send({
      name: 'Sergio Montoya',
      password: 'MyPass123!'
    })
    .expect(400)

  expect(_message).toBe('User validation failed')
})

test('Should be able to login with valid user', async () => {
  const response = await request(app)
    .post('/users/login')
    .send({
      email: validUser.email,
      password: validUser.password
    }).expect(200)

    const user = await User.findById(response.body.user._id)

    // Check response token is same as new on DB
    expect(response.body.token).toBe(user.tokens[1].token)
})

test('Should not be able to login with incorrect information', async () => {
  await request(app)
    .post('/users/login')
    .send({
      email: validUser.email,
      password: 'incorrectPassword123'
    }).expect(400)
})

test('Should get profile for user', async () => {
  await request(app)
    .get('/users/me')
    .set('Authorization', `Bearer ${validUser.tokens[0].token}`)
    .send()
    .expect(200)
})

test('Should not get profile for non logged in users', async () => {
  await request(app)
    .get('/users/me')
    .send()
    .expect(401)
})

test('Should delete account for a user', async () => {
  await request(app)
    .delete('/users/me')
    .set('Authorization', `Bearer ${validUser.tokens[0].token}`)
    .send()
    .expect(200)


  // Check user did delete from DB
  const user = await User.findById(validUserId)
  expect(user).toBeNull()
})

test('Should not delete account of unauthenticated user', async () => {
  await request(app)
    .delete('/users/me')
    .send()
    .expect(401)
})

test('Should upload avatar image', async () => {
  await request(app)
    .post('/users/me/avatar')
    .set('Authorization', `Bearer ${validUser.tokens[0].token}`)
    .attach('avatar', 'tests/fixtures/profile-pic.jpg')
    .expect(200)

  const user = await User.findById(validUserId)
  expect(user.avatar).toEqual(expect.any(Buffer))
})

test('Should update valid fields', async () => {
  await request(app)
    .patch(`/users/me`)
    .set('Authorization', `Bearer ${validUser.tokens[0].token}`)
    .send({
      name: 'Francisco'
    })
    .expect(200)

  const user = await User.findById(validUserId)
  expect(user.name).toBe('Francisco')
})

test('Should no be able to update invalid fields', async () => {
  await request(app)
    .patch(`/users/me`)
    .set('Authorization', `Bearer ${validUser.tokens[0].token}`)
    .send({
      invalidField: 'Some Content'
    })
    .expect(400)
})
