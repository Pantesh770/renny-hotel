const express = require('express');
const router = express.Router();
const { recommend } = require('../controllers/recommendController');

router.post('/', recommend);

module.exports = router;
