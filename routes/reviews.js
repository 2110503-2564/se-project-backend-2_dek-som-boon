const express = require('express');

const {getReview,getReviews,createReview,updateReview,deleteReview} = require('../controllers/reviews');

const router = express.Router({mergeParams: true});

const {protect, authorize} = require('../middleware/auth');
  
router.route('/')
    .get(getReviews)
    .post(protect,authorize('admin', 'user'), createReview);
router.route('/:id')
    .get(getReview)
    .put(protect,authorize('user'), updateReview)
    .delete(protect,authorize('admin', 'user'), deleteReview);

module.exports = router;