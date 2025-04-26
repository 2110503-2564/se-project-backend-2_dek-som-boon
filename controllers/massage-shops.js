// const Hospital = require('../models/Hospital.js');
// const Appointment = require('../models/Appointment.js');
const MassageShop = require('../models/MassageShop.js')
const Reservation = require('../models/Reservation.js');

//@desc    Get all massage shops
//@route   GET /api/v1/massage-shops
//@access  Public
exports.getMassageShops = async (req, res, next) => {
  let query;

  // Copy req.query
  const reqQuery = {...req.query};

  // Fields to exclude
  const removeFields = ['select', 'sort', 'page', 'limit'];

  // Loop over remove fields and delete them from reqQuery
  removeFields.forEach(param => delete reqQuery[param]);
  console.log(reqQuery);

  // Create query string 
  let queryStr = JSON.stringify(reqQuery);

  // Create operators ($gt, %gte, etc)
  queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match=>`$${match}`);

  // Finding resource
  query = MassageShop.find(JSON.parse(queryStr)).populate('reservations');

  // Select Fields
  if(req.query.select){
    const fields = req.query.select.split(',').join(' ');
    query = query.select(fields);
  }

  // Sort
  if(req.query.sort){
    const sortBy = req.query.sort.split(',').join(' ');
    query = query.sort(sortBy);
  }
  else{
    query = query.sort('-createdAt');
  }

  // Pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 25;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;

  try {   
    const total = await MassageShop.countDocuments();
    query = query.skip(startIndex).limit(limit);

    // Pagination result
    const pagination = {};

    if(endIndex < total){
      pagination.next = {
        page: page + 1,
        limit
      }
    }

    if(startIndex > 0){
      pagination.prev = {
        page: page -1,
        limit
      }
    }
    
    const massageShops = await query;
    res.status(200).json({
      success: true,
      count: massageShops.length,
      data: massageShops
    });

  } catch (err) {
    res.status(500).json({ success: false });
  }

};
  
//@desc    Get single massage shop
//@route   GET /api/v1/massage-shops/:id
//@access  Public
exports.getMassageShop = async (req, res, next) => {
  try {
    const massageShop = await MassageShop.findById(req.params.id);
    if(!massageShop){
      return res.status(404).json({success: false});
    }
    res.status(200).json({
      success: true,
      data: massageShop
    });
  } catch (err) {
    res.status(500).json({ success: false });
  }
};

//@desc    Create new massage shop
//@route   POST /api/v1/massage-shops
//@access  Private
exports.createMassageShop = async (req, res, next) => {
  const massageShop = await MassageShop.create(req.body);
  res.status(201).json({
    success: true,
    data: massageShop
  });

};

//@desc    Update massage shop
//@route   PUT /api/v1/massage-shops/:id
//@access  Private
exports.updateMassageShop = async (req, res, next) => {
  try {
    const massageShop = await MassageShop.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if(!massageShop){
      return res.status(404).json({success: false});
    }
    res.status(200).json({
      success: true,
      data: massageShop
    });
  } catch (err) {
    res.status(200).json({ success: false });
  }
};

//@desc    Delete massage shop
//@route   DELETE /api/v1/massage-shops/:id
//@access  Private
exports.deleteMassageShop = async (req, res, next) => {
  try {
    const massageShop = await MassageShop.findById(req.params.id);

    if(!massageShop){
      return res.status(404).json({success: false, message: `Massage shop not found with id of ${req.params.id}`});
    }

    await Reservation.deleteMany({ massageShop: req.params.id });
    await MassageShop.deleteOne({ _id: req.params.id });
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    res.status(500).json({ success: false });
  }
};


