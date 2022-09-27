import nc from 'next-connect'
import Product from '../../../models/Product'
import connectDB, { disconnectDB } from '../../../utils/db'

connectDB()

const handler = nc()

handler.get(async (req, res) => {
  const products = await Product.find()
  //   await disconnectDB()
  return res.json(products)
})

export default handler
