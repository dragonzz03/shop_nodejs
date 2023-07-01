const express = require("express")
const router = express.Router()
const formContronller = require("../app/controllers/FormControllers")

router.get("/:slug", formContronller.show)
router.get("/", formContronller.index)

module.exports = router
