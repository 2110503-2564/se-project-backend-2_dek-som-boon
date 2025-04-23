const Reservation = require('../models/Reservation');
const MassageShop = require('../models/MassageShop'); 
const Therapist = require('../models/Therapist');

// @desc   Get all reservations
// @route  GET /api/v1/reservations
// @access Public
exports.getReservations = async (req, res, next) => {
    console.log("user: ", req.user);
    let query;

    if (req.user.role !== 'admin') {
        query = Reservation.find({ user: req.user.id })
            .populate({
                path: 'massageShop',
                select: 'name province tel'
            })
            .populate({
                path: 'therapist',
                select: 'name experience specialty'
            });
    } else {
        if (req.params.massageShopId) {
            console.log(req.params.massageShopId);
            query = Reservation.find({ massageShop: req.params.massageShopId })
                .populate({
                    path: 'massageShop',
                    select: 'name province tel'
                })
                .populate({
                    path: 'therapist',
                    select: 'name experience specialty'
                });
        } else {
            query = Reservation.find()
                .populate({
                    path: 'massageShop',
                    select: 'name province tel'
                })
                .populate({
                    path: 'therapist',
                    select: 'name experience specialty'
                });
        }
    }

    try {
        const reservations = await query;

        res.status(200).json({
            success: true,
            count: reservations.length,
            data: reservations
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Cannot find Reservation" });
    }
};

// @desc   Get single reservation
// @route  GET /api/v1/reservations/:id
// @access Public
exports.getReservation = async (req, res, next) => {
    try {
        const reservation = await Reservation.findById(req.params.id)
            .populate({
                path: 'massageShop',
                select: 'name description tel'
            })
            .populate({
                path: 'therapist',
                select: 'name experience specialty'
            });

        if (!reservation) {
            return res.status(404).json({ success: false, message: `No reservation with the id of ${req.params.id}` });
        }

        res.status(200).json({
            success: true,
            data: reservation
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Cannot find Reservation" });
    }
};

// @desc   Add reservation
// @route  POST /api/v1/massage-shops/:massageShopId/reservation
// @access Private
exports.addReservation = async (req, res, next) => {
    try {
        req.body.massageShop = req.params.massageShopId;
        console.log("req.params:", req.params);

        const massageShop = await MassageShop.findById(req.params.massageShopId);
        if (!massageShop) {
            return res.status(404).json({ success: false, message: `No massage shop with the id of ${req.params.massageShopId}` });
        }

        req.body.user = req.user.id;

        const existedReservations = await Reservation.find({ user: req.user.id });
        if (existedReservations.length >= 3 && req.user.role !== 'admin') {
            return res.status(400).json({
                success: false,
                message: `The user with ID ${req.user.id} has already made 3 reservations`
            });
        }

        const reservation = await Reservation.create(req.body);

        res.status(201).json({
            success: true,
            data: reservation
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Cannot create Reservation" });
    }
};

// @desc Update reservation
// @route PUT /api/v1/reservations/:id
// @access Private
exports.updateReservation = async (req, res, next) => {
    try {
        let reservation = await Reservation.findById(req.params.id);
        console.log("reservation: ", reservation, "req.user.id: ", req.user.id);

        if (!reservation) {
            return res.status(404).json({ success: false, message: `No reservation with the id of ${req.params.id}` });
        }

        if (reservation.user.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(400).json({ success: false, message: `User ${req.user.id} is not authorized to update this reservation` });
        }

        reservation = await Reservation.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({
            success: true,
            data: reservation
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Cannot update Reservation" });
    }
};

// @desc Delete reservation
// @route DELETE /api/v1/reservations/:id
// @access Private
exports.deleteReservation = async (req, res, next) => {
    try {
        const reservation = await Reservation.findById(req.params.id);

        if (!reservation) {
            return res.status(404).json({ success: false, message: `No reservation with the id of ${req.params.id}` });
        }

        if (reservation.user.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(400).json({ success: false, message: `User ${req.user.id} is not authorized to delete this reservation` });
        }

        await reservation.deleteOne();

        res.status(200).json({
            success: true,
            data: {}
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Cannot delete Reservation" });
    }
};
