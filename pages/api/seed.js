import nc from 'next-connect'
import Product from '../../models/Product'
import connectDB, { disconnectDB } from '../../utils/db'
import data from '../../utils/data'
import User from '../../models/User'

const handler = nc()

handler.get(async (req, res) => {
  await connectDB()
  //seed products in database
  await Product.deleteMany()
  await Product.insertMany(data.products)
  //seed users
  await User.deleteMany()
  await User.insertMany(data.users)
  //   await disconnectDB()
  res.send({ message: 'seeded successfully' })
})

export default handler
