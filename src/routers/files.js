const express = require('express')
const router = express.Router()

// Uploads
const multer = require('multer')

const upload = multer({
  dest: 'images',
  limits: {
    fileSize: 1000
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.endsWith('.pdf')) {
      return cb(new Error('Only images'))
    }

    return cb(undefined, true)
  }
})

router.post('/upload', upload.single('upload'), (req, res) => {
  res.send()
})

module.exports = router