const mongoose = require('mongoose')

const MassageShopSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name'],
        unique: true,
        trim: true,
        maxlength: [50, 'Name can not be more than 50 characters'] 
    },
    address: {
        type: String,
        required: [true, 'Please add an address'],
    },
    // district: {
    //     type: String,
    //     required: [true, 'Please add a district'],
    // },
    // postalcode: {
    //     type: String,
    //     required: [true, 'Please add a postalcode'],
    //     maxlength: [50, 'Postal Code can not be more than 5 digits'] 
    // },
    tel: {
        type: String,
    },
    // region: {
    //     type: String,
    //     required: [true, 'Please add a region'],
    // },

    // เพิ่มเวลาเปิด-ปิด
    openTime: { type: String, required: true },
    closeTime: { type: String, required: true },
}, {
    toJSON: {virtuals: true},
    toObject: {virtuals: true}
});


// Reverse populate with virtuals
MassageShopSchema.virtual('reservations',{
    ref: 'Reservation',
    localField: '_id',
    foreignField: 'massageShop',
    justOne: false
});

module.exports = mongoose.model('MassageShop', MassageShopSchema);