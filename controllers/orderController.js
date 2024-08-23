const OrderDetails = require('../models/OrderDetails')
const Cart = require('../models/Cart')

exports.addOrder = async(req, res) => {
    try {
        const { orderId, items, totalPrice, userId } = req.body

        // Validate request data
        if (!orderId || !items || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ message: 'Invalid order data' })
        }

        // Create a new order with the calculated total price
        const newOrder = new OrderDetails({
            orderId,
            items,
            totalPrice,
            userId,
        })

        // Save the order to the database
        const savedOrder = await newOrder.save()

        await Cart.deleteMany({ userId })

        // Respond with the saved order details
        return res.status(201).json({
            message: 'Order created successfully',
            order: savedOrder,
        })
    } catch (error) {
        console.error('Error creating order:', error)
        return res.status(500).json({ message: 'Internal Server Error' })
    }
}

exports.getOrderHistory = async(req, res) => {
    try {
        const { userId } = req.params

        // Validate userId
        if (!userId) {
            return res.status(400).json({ message: 'User ID is required' })
        }

        console.log('userId:', userId) // Debugging log

        // Fetch orders for the specified user and sort by date descending
        const orders = await OrderDetails.find({ userId }).sort({ orderDate: -1 })

        console.log('Fetched orders:', orders) // Debugging log

        if (!orders.length) {
            return res.status(404).json({ message: 'No orders found for this user' })
        }

        // Map orders to include additional details for response
        const orderHistory = orders.map((order) => ({
            orderId: order.orderId, // Use order.orderId instead of order._id
            orderDate: order.orderDate,
            totalItems: order.items.reduce((sum, item) => sum + item.qty, 0),
            totalPrice: order.totalPrice,
        }))

        return res.status(200).json({ orders: orderHistory })
    } catch (error) {
        console.error('Error fetching order history:', error)
        return res.status(500).json({ message: 'Internal Server Error' })
    }
}