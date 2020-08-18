const Task = require('../models/task')
const validateParams = require('../utils/permited-params')

const permitedParams = ['description', 'completed']
const allowedSearchParams = ['completed']

const create = async (req, res) => {
  const task = new Task({
    ...req.body,
    owner: req.user._id
  })

  try {
    await task.save()
    res.status(201).send(task)
  } catch (error) {
    res.status(400).send(error)
  }
}


// Get all tasks or filtered
const all = async (req, res) => {
  const match = req.query
  const {limit, skip, sortBy} = match
  const sort = {}

  delete match.limit
  delete match.skip
  delete match.sortBy

  if (sortBy) {
    const parts = sortBy.split(':')
    sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
  }

  try {
    await req.user.populate({
      path: 'tasks',
      match,
      options: {
        sort,
        limit: parseInt(limit),
        skip: parseInt(skip)
      }
    }).execPopulate()
    res.send(req .user.tasks)
  } catch (error) {
    console.log(error)
    res.status(500).send()
  }
}

const find = async (req, res) => {
  const _id = req.params.id
  try {
    const task = await Task.findOne({
      _id,
      owner: req.user._id
    })

    if (!task) return res.status(404).send()
    res.send(task)
  } catch (error) {
    res.status(500).send()
  }
}

const update = async (req, res) => {
  const updateParams = req.body

  if (!validateParams(updateParams, permitedParams)) return res.status(400).send({
    error: 'Unpermitted params'
  })

  try  {
    const task = await Task.findOne({
      _id: req.params.id,
      owner: req.user._id
    })

    if (!task) return res.status(404).send()

    Object.keys(updateParams).forEach(param => task[param] = updateParams[param])
    task.save()

    res.send(task)
  } catch (error) {
    console.log(error)
    res.status(500).send(error)
  }
}

const remove = async (req, res) => {
  const _id = req.params.id
  try {
    const task = await Task.findOneAndDelete({
      _id,
      owner: req.user._id
    })
    if (!task) return res.status(404).send()
    res.send(task)
  } catch (error) {
    res.status(500).send()
  }
}

module.exports = {
  create,
  all,
  find,
  update,
  remove
}