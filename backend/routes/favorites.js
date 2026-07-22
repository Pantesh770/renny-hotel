const express = require('express');
const router = express.Router();
const favoriteController = require('../controllers/favoriteController');
const { auth } = require('../middleware/auth');

router.get('/', auth, favoriteController.getMine);
router.post('/:hotelId', auth, favoriteController.toggle);
router.get('/:hotelId', auth, favoriteController.check);

module.exports = router;
