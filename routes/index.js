const express = require('express');
const router = express.Router()
const executeController = require('../controllers/executeController');

// @desc Home
// @route GET /
router.get('/', (req, res) => {
    res.render('home');
});

// @desc Handle post requests
// @route POST /
router.post('/', async (req, res) => {
    executeController.handleRequest(req, res);
});

module.exports = router