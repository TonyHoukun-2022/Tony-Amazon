import nc from 'next-connect'
import Product from '../../../models/Product'

const handler = nc()

handler.get(async (req, res) => {
  const products = await Product.find({}, '-reviews')
  //   await disconnectDB()
  return res.json(products)
})

export default handler
