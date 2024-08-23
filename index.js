const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const { MongoClient, ServerApiVersion } = require('mongodb')

const bodyParser = require('body-parser')

// Controllers
const userController = require('./controllers/userController')
const itemController = require('./controllers/itemController')
const cartController = require('./controllers/cartController')
const orderController = require('./controllers/orderController')

const uri =
  'mongodb+srv://toluphilip619:9clb0sFd12UhQSub@cluster0.mst9p.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'

// Initialize the app
const app = express()
const PORT = 4000

app.use(cors())
app.options('*', cors())
app.use(express.json())
// Middleware for parsing JSON bodies
app.use(bodyParser.json())

// Connect to MongoDB

mongoose
  .connect(
    'mongodb+srv://toluphilip619:9clb0sFd12UhQSub@cluster0.mst9p.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0',
    {}
  )
  .then(() => {
    console.log('Connected to MongoDB...')
  })
  .catch((err) => {
    console.error('Could not connect to MongoDB...', err)
  })
// const client = new MongoClient(uri, {
//   serverApi: {
//     version: ServerApiVersion.v1,
//     strict: true,
//     deprecationErrors: true,
//   },
// })
// async function run() {
//   try {
//     // Connect the client to the server	(optional starting in v4.7)
//     await client.connect()
//     // Send a ping to confirm a successful connection
//     await client.db('admin').command({ ping: 1 })
//     console.log(
//       'Pinged your deployment. You successfully connected to MongoDB!'
//     )
//   } finally {
//     // Ensures that the client will close when you finish/error
//     await client.close()
//   }
// }
// run().catch(console.dir)
// Routes
app.post('/signup', userController.signup)
app.post('/login', userController.login)
app.post('/reset-password', userController.resetPassword)

app.get('/items', itemController.showItems)
app.get('/item/:id', itemController.showItem)
app.post('/cart', cartController.addToCart)
app.post('/removeFromCart', cartController.removeFromCart)
app.patch('/cart/decreaseQuantity', cartController.decreaseQuantity)
app.patch('/cart/increaseQuantity', cartController.increaseQuantity)
app.post('/clearCart', cartController.clearCart)

app.get('/cart/:userId', cartController.showCart)
app.post('/order', orderController.addOrder)
app.get('/orders/:userId', orderController.getOrderHistory)

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port${PORT}`)
})
