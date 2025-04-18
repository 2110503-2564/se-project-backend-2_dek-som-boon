const Review = require('../models/Review');

// @desc    Get all reviews or reviews for one massage shop
// @route   GET /api/v1/reviews
// @route   GET /api/v1/massage-shops/:massageShopId/reviews
// @access  Public
exports.getReviews = async (req, res, next) => {
  try {
    let query;

    if (req.params.massageShopId) {
      query = Review.find({ massageShop: req.params.massageShopId });
    } else {
      query = Review.find();
    }

    query = query
      .populate({ path: 'user', select: 'name username' })
      .populate({ path: 'massageShop', select: 'name province tel' });

    const reviews = await query;

    res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

  

// @desc    Get single review
// @route   GET /api/v1/reviews/:id
// @access  Public
exports.getReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }
    res.status(200).json({ success: true, data: review });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// @desc    Create new review for a specific massage shop
// @route   POST /api/v1/massage-shops/:massageShopId/reviews
// @access  Private
exports.createReview = async (req, res, next) => {
    try {
      req.body.massageShop = req.params.massageShopId;
      req.body.user = req.user.id;
  
      const review = await Review.create(req.body);
      res.status(201).json({ success: true, data: review });
    } catch (err) {
      res.status(400).json({ success: false, error: err.message });
    }
  };

// @desc    Update review
// @route   PUT /api/v1/reviews/:id
// @access  Private
exports.updateReview = async (req, res, next) => {
    try {
      let review = await Review.findById(req.params.id);
      if (!review) {
        return res.status(404).json({ success: false, message: 'Review not found' });
      }
  
      if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
        return res.status(403).json({ success: false, message: 'Not authorized to update this review' });
      }
  
      review = await Review.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
      });
  
      res.status(200).json({ success: true, data: review });
    } catch (err) {
      res.status(400).json({ success: false, error: err.message });
    }
  };
  
  
    // @desc    Delete review
    // @route   DELETE /api/v1/reviews/:id
    // @access  Private
    exports.deleteReview = async (req, res, next) => {
        try {
        const review = await Review.findById(req.params.id);
        if (!review) {
            return res.status(404).json({ success: false, message: 'Review not found' });
        }
    
        // Check ownership or admin
        if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ success: false, message: 'Not authorized to delete this review' });
        }
    
        await review.deleteOne();
        res.status(200).json({ success: true, data: {} });
        } catch (err) {
        res.status(500).json({ success: false, error: err.message });
        }
    };
  
  
