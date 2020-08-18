const User = require('../models/user')
const validateParams = require('../utils/permited-params')
const sharp = require('sharp')
const { sendWelcomeEmail, sendCancellationEmail } = require('../emails/account')

const permitedParams = ['name', 'password', 'email', 'age']

const login = async (req, res) => {
  try {
    const user = await User.findByCredentials(req.body.email, req.body.password)
    const token = await user.generateAuthToken()
    res.send({ user, token})
  } catch (error) {
    res.status(400).send('Unable to login')
  }
}

const create = async (req, res) => {
  const user = new User(req.body)
  try  {
    await user.save()
    sendWelcomeEmail(user.email, user.name)
    const token = await user.generateAuthToken()
    res.status(201).send({ user, token })
  } catch (error) {
    res.status(400).send(error)
  }
}

const me = async (req, res) => {
  res.send(req.user)
}

const update = async (req, res) => {
  const params = req.body

  if (!validateParams(params, permitedParams)) return res.status(400).send( {
    error: 'Unpermitted params'
  })

  try {

    Object.keys(params).forEach( param => req.user[param] = params[param])
    await req.user.save()

    res.send(req.user)
  } catch (error) {
    res.status(500).send(error)
  }
}

const remove = async (req, res) => {
  try {
    const { user } = req
    await user.remove()
    sendCancellationEmail(user.email, user.name)
    res.send(user)
  } catch (error) {
    console.log(error)
    res.status(500).send(error)
  }
}

const logout = async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter(el => el.token !== req.token )
    await req.user.save()
    res.send()
  } catch (error) {
    res.status(500).send()
  }
}

const logoutAll = async (req, res) => {
  try {
    req.user.tokens = []
    await req.user.save()
    res.send()
  } catch (error) {
    res.status(500).send()
  }
}

const avatar = async (req, res) => {
  try {
    const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250 }).png().toBuffer()
    req.user.avatar = buffer
    await req.user.save()
    res.send(req.user)
  } catch (error) {
    console.log(error)
    res.status(500).send()
  }
}

const avatarDelete = async (req, res) => {
  try {
    req.user.avatar = undefined
    await req.user.save()
    res.send(req.user)
  } catch (error) {
    console.log(error)
    res.status(500).send()
  }
}

const avatarRead = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
    if (!user || !user.avatar) throw new Error()

    res.set('Content-Type', 'image/png')
    res.send(user.avatar)
  } catch (error) {
    res.status(404).send()
  }
}

module.exports = {
  create,
  me,
  update,
  remove,
  login,
  logout,
  logoutAll,
  avatar,
  avatarDelete,
  avatarRead
}