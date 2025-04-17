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

    tel: {
        type: String,
    },
    openTime: { type: String, required: true },
    closeTime: { type: String, required: true },
}, {
    toJSON: {virtuals: true},
    toObject: {virtuals: true}
});



MassageShopSchema.virtual('reservations',{
    ref: 'Reservation',
    localField: '_id',
    foreignField: 'massageShop',
    justOne: false
});

MassageShopSchema.virtual('reviews', {
    ref: 'Review',
    localField: '_id',
    foreignField: 'massageShop',
    justOne: false
});

module.exports = mongoose.model('MassageShop', MassageShopSchema);