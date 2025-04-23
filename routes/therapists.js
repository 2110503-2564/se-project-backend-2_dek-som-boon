const express = require('express');

const {getTherapists,getTherapist,createTherapist,updateTherapist,deleteTherapist} = require('../controllers/therapists');

const router = express.Router({mergeParams: true});

const {protect, authorize} = require('../middleware/auth');
  
router.route('/')
    .get(getTherapists)
    .post(protect,authorize('admin'), createTherapist);
router.route('/:id')
    .get(getTherapist)
    .put(protect,authorize('admin'), updateTherapist)
    .delete(protect,authorize('admin'), deleteTherapist);

module.exports = router;