const express = require('express');
const router = express.Router();
const EvaluateControllers = require('../app/controllers/EvaluateControllers');

//Edit Categoty router
router.post('/addComment/:commentContent/:idProduct', EvaluateControllers.addCommentProcess);

router.post('/addEvaluate', EvaluateControllers.evaluateProcess);

module.exports = router