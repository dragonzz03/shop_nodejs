const express = require('express')
const router = express.Router()
const formContronller = require('../app/controllers/FormControllers')


router.use('/', formContronller.index)


module.exports = router