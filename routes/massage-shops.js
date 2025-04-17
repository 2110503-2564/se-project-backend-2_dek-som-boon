const express = require('express');
const { getMassageShops, getMassageShop, createMassageShop, updateMassageShop, deleteMassageShop } = require('../controllers/massage-shops');

// Include other resource rounters
const appointmentRouter = require('./reservations');

const router = express.Router();

const {protect, authorize} = require('../middleware/auth');

// Re-route into other resoutce routers
router.use('/:massageShopId/reservations/', appointmentRouter);



router.route('/').get(getMassageShops).post(protect, authorize('admin'), createMassageShop)
router.route('/:id').get(getMassageShop).put(protect, authorize('admin'), updateMassageShop).delete(protect, authorize('admin'), deleteMassageShop);

module.exports = router;
