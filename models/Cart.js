const mongoose = require('mongoose')
const cartSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    itemId: { type: mongoose.Schema.Types.ObjectId, ref: 'Item', required: true },
    qty: { type: Number, required: true },
    ordered: { type: Boolean, required: true, default: false },
    price: { type: Number, required: true, ref: 'Item' },
    name: { type: String, required: true, ref: 'Item' },
    photo: { type: String, required: true, ref: 'Item' },
})
module.exports = mongoose.model('Cart', cartSchema)