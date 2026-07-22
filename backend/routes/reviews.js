const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const { auth, adminOnly } = require('../middleware/auth');

router.get('/hotel/:hotelId', reviewController.getByHotel);
router.post('/hotel/:hotelId', auth, reviewController.create);
router.delete('/:id', auth, adminOnly, reviewController.remove);

module.exports = router;
