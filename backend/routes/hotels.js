const express = require('express');
const router = express.Router();
const hotelController = require('../controllers/hotelController');
const { auth, adminOnly } = require('../middleware/auth');

router.get('/', hotelController.getAll);
router.get('/cities', hotelController.getCities);
router.get('/regions', hotelController.getRegions);
router.get('/amenities', hotelController.getAmenities);
router.get('/:id', hotelController.getById);
router.post('/', auth, adminOnly, hotelController.create);
router.put('/:id', auth, adminOnly, hotelController.update);
router.delete('/:id', auth, adminOnly, hotelController.remove);

module.exports = router;
