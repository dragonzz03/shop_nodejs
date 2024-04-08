const express = require("express")
const router = express.Router()
const ErrorControllers = require("../app/controllers/ErrorControllers")

// Home router
router.use(ErrorControllers.index)

module.exports = router
