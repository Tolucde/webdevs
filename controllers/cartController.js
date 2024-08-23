const Cart = require('../models/Cart')

exports.addToCart = async(req, res) => {
    const { userId, itemId, qty, price, name, photo } = req.body

    try {
        // Check if the item is already in the cart
        const existingItem = await Cart.findOne({
            userId,
            itemId,
            ordered: false,
        })

        if (existingItem) {
            // Item is already in the cart
            return res.status(409).json({ message: 'Item already in cart' })
        }

        // Create a new cart item
        const cartItem = new Cart({
            userId,
            itemId,
            qty,
            price,
            name,
            photo,
        })

        // Save the cart item to the database
        const result = await cartItem.save()

        // Respond with the cart item ID and success
        res.status(201).json({ cartId: result._id, message: 'Item added to cart' })
    } catch (error) {
        res.status(500).json({ message: 'Error adding to cart' })
    }
}

exports.showCart = async(req, res) => {
    const { userId } = req.params
    try {
        // Retrieve all non-ordered cart items for the user
        const cartItems = await Cart.find({ userId, ordered: false })
            // Respond with the user's cart items
        res.status(200).json(cartItems)
    } catch (error) {
        // Handle potential errors
        res.status(500).json({ message: 'Error retrieving cart items' })
    }
}

exports.removeFromCart = async(req, res) => {
    const { userId, itemId } = req.body

    try {
        const cartItem = await Cart.findOneAndDelete({ userId, itemId })
        if (!cartItem) {
            return res.status(404).json({ message: 'Item not found in cart' })
        }
        res.status(200).json({ message: 'Item removed from cart' })
    } catch (error) {
        console.error('Error removing item from cart:', error)
        res.status(500).json({ message: 'Error removing item from cart' })
    }
}

// Decrease item quantity in the cart
exports.decreaseQuantity = async(req, res) => {
    const { userId, itemId, qty } = req.body

    try {
        // Find the cart item
        const cartItem = await Cart.findOne({ userId, itemId, ordered: false })

        if (!cartItem) {
            return res.status(404).json({ message: 'Item not found in cart' })
        }

        // Check if the requested quantity to decrease is valid
        if (qty <= 0 || qty > cartItem.qty) {
            return res.status(400).json({ message: 'Invalid quantity to decrease' })
        }

        // Decrease the quantity
        cartItem.qty -= 1

        // Remove the item from the cart if quantity becomes 0
        if (cartItem.qty === 0) {
            await Cart.findByIdAndDelete(cartItem._id)
            return res
                .status(200)
                .json({ message: 'Item removed from cart as quantity is 0' })
        } else {
            // Save the updated cart item
            await cartItem.save()
            return res
                .status(200)
                .json({ message: 'Quantity decreased successfully', cartItem })
        }
    } catch (error) {
        // Handle potential errors
        console.error('Error decreasing item quantity:', error)
        res.status(500).json({ message: 'Error updating item quantity' })
    }
}

// Increase item quantity in the cart
exports.increaseQuantity = async(req, res) => {
    const { userId, itemId, qty } = req.body

    try {
        // Find the cart item
        const cartItem = await Cart.findOne({ userId, itemId, ordered: false })

        if (!cartItem) {
            return res.status(404).json({ message: 'Item not found in cart' })
        }

        // Increase the quantity
        cartItem.qty += 1

        // Save the updated cart item
        await cartItem.save()
        return res
            .status(200)
            .json({ message: 'Quantity increased successfully', cartItem })
    } catch (error) {
        // Handle potential errors
        console.error('Error increasing item quantity:', error)
        res.status(500).json({ message: 'Error updating item quantity' })
    }
}

exports.clearCart = async(req, res) => {
    const { userId } = req.body

    try {
        // Delete all cart items for the specified user
        const result = await Cart.deleteMany({ userId })

        // Respond with success message
        res.status(200).json({ message: 'Cart cleared successfully' })
    } catch (error) {
        console.error('Error clearing cart:', error)
        res.status(500).json({ message: 'Error clearing cart' })
    }
}