const mongoose = require('mongoose')
const Schema = mongoose.Schema

// Define the schema for items within an order
const itemSchema = new Schema({
    itemId: { type: mongoose.Schema.Types.ObjectId, ref: 'Item', required: true }, // Reference to the Item model
    name: { type: String, required: true },
    qty: { type: Number, required: true }, // Quantity of the item
    price: { type: Number, required: true }, // Price per unit of the item
})

// Define the schema for the order details
const orderDetailsSchema = new Schema({
    userId: { type: String },
    orderDate: { type: Date, default: Date.now },
    status: { type: String, default: 'Pending' },
    orderId: { type: String, required: true }, // Unique identifier for the order
    items: [itemSchema], // Array of items
    totalPrice: { type: Number, required: true }, // Total price for all items in the order
})

// Create the model from the schema
const OrderDetails = mongoose.model('OrderDetails', orderDetailsSchema)

module.exports = OrderDetails