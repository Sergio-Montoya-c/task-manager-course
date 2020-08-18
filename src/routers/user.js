const express = require('express')
const router = express.Router()
const user = require('../controllers/users')

// Middleware
const auth = require('../middleware/auth')
const multer = require('multer')

const upload = multer({
  limits: {
    fileSize: 1024 * 1000 * 1
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|png|jpeg)$/)) {
      return cb(new Error('Only images'))
    }

    return cb(undefined, true)
  }
})

const routeErrorHandler = (error, req, res, next) => {
  res.status(400).send({
    error: error.message
  })
}

router.get('/users/me', auth, user.me)
router.patch('/users/me', auth, user.update)
router.delete('/users/me', auth, user.remove)
router.post('/users/me/avatar', auth,  upload.single('avatar') , user.avatar, routeErrorHandler)
router.delete('/users/me/avatar', auth, user.avatarDelete)
router.get('/users/:id/avatar', user.avatarRead)
router.post('/users', user.create)
router.post('/users/login', user.login)
router.post('/users/logout', auth, user.logout)
router.post('/users/logoutAll', auth, user.logoutAll)

module.exports = router