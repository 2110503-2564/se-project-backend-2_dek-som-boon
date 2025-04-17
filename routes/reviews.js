const express = require('express');

const {getReview,getReviews,createReview,updateReview,deleteReview} = require('../controllers/reviews');

const router = express.Router({mergeParams: true});

const {protect, authorize} = require('../middleware/auth');
router.get('/test', (req, res) => {
    res.send(`Reviews for shop: ${req.params.massageShopId}`);
  });
  
router.route('/')
    .get(protect, getReviews)
    .post(protect,authorize('admin', 'user'), createReview);
router.route('/:id')
    .get(protect, getReview)
    .put(protect,authorize('admin', 'user'), updateReview)
    .delete(protect,authorize('admin', 'user'), deleteReview);

module.exports = router;