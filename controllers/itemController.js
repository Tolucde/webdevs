const Item = require('../models/Items')
exports.showItems = async(req, res) => {
    try {
        // Retrieve all items from the database
        const items = await Item.find({})
            // Respond with the array of items
        res.status(200).json(items)
    } catch (error) {
        // Handle errors during retrieval
        res.status(500).json({ message: 'Error retrieving items' })
    }
}
exports.showItem = async(req, res) => {
    console.log('Request params:', req.params) // Log request parameters
    try {
        const item = await Item.findById(req.params.id)
        if (!item) {
            console.log('Item not found:', req.params.id) // Log if item is not found
            return res.status(404).json({ message: 'Item not found' })
        }
        console.log('Item found:', item) // Log the found item
        res.status(200).json(item)
    } catch (error) {
        console.error('Error retrieving item:', error) // Log the error
        res.status(500).json({ message: 'Error retrieving item' })
    }
}