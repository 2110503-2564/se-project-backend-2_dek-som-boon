const Therapist = require('../models/Therapist');
const MassageShop = require('../models/MassageShop');
const Reservation = require('../models/Reservation');

// @desc    Get all therapists or therapists for one massage shop
// @route   GET /api/v1/therapists
// @route   GET /api/v1/massage-shops/:massageShopId/therapists
// @access  Public
exports.getTherapists = async (req, res) => {
  try {
    let query;

    if (req.params.massageShopId) {
      query = Therapist.find({ massageShop: req.params.massageShopId });
    } else {
      query = Therapist.find();
    }

    query = query.populate({ path: 'massageShop', select: 'name address tel' });

    const therapists = await query;

    res.status(200).json({
      success: true,
      count: therapists.length,
      data: therapists,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// @desc    Get single therapist
// @route   GET /api/v1/therapists/:id
// @access  Public
exports.getTherapist = async (req, res) => {
  try {
    const therapist = await Therapist.findById(req.params.id).populate('massageShop');
    if (!therapist) {
      return res.status(404).json({ success: false, message: 'Therapist not found' });
    }

    res.status(200).json({ success: true, data: therapist });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// @desc    Create new therapist for a specific massage shop
// @route   POST /api/v1/massage-shops/:massageShopId/therapists
// @access  Private
exports.createTherapist = async (req, res) => {
  try {
    req.body.massageShop = req.params.massageShopId;

    const shop = await MassageShop.findById(req.params.massageShopId);
    if (!shop) {
      return res.status(404).json({ success: false, message: 'Massage shop not found' });
    }

    const therapist = await Therapist.create(req.body);
    res.status(201).json({ success: true, data: therapist });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc    Update therapist
// @route   PUT /api/v1/therapists/:id
// @access  Private
exports.updateTherapist = async (req, res) => {
  try {
    let therapist = await Therapist.findById(req.params.id);
    if (!therapist) {
      return res.status(404).json({ success: false, message: 'Therapist not found' });
    }

    therapist = await Therapist.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({ success: true, data: therapist });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc    Delete therapist
// @route   DELETE /api/v1/therapists/:id
// @access  Private
exports.deleteTherapist = async (req, res) => {
  try {
    const therapist = await Therapist.findById(req.params.id);
    const reservations = await Reservation.find({ therapist: req.params.id });
    console.log('reservations: ', reservations);
    if (reservations.length > 0) {
      return res.status(400).json({ success: false, message: 'Cannot delete therapist with existing reservations' });
    }
    if (!therapist) {
      return res.status(404).json({ success: false, message: 'Therapist not found' });
    }

    await therapist.deleteOne();
    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};