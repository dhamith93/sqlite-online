const express = require('express');
const router = express.Router();
const csurf = require('csurf');
const csurfProtection = csurf();
const executeController = require('../controllers/executeController');

router.use(csurfProtection);

// @desc Home
// @route GET /
router.get('/', (req, res) => {
    res.render('home', {csrfToken: req.csrfToken()});
});

// @desc Handle post requests
// @route POST /
router.post('/', async (req, res) => {
    executeController.handleRequest(req, res);
});

module.exports = router