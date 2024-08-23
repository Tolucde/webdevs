const mongoose = require('mongoose')
const itemSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    photo: { type: String, required: true },
    description: { type: String, required: false },
})
module.exports = mongoose.model('Item', itemSchema)