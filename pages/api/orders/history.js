import nc from 'next-connect'
import Order from '../../../models/Order'
import { isAuth } from '../../../utils/auth.js'
import { onError } from '../../../utils/error'

const handler = nc({ onError })
//middleware => only authorized user can place an order
//save decoded in req.user, decoded
handler.use(isAuth)

handler.get(async (req, res) => {
  const orders = await Order.find({ user: req.user._id })
  if (!orders || orders.length === 0) {
    return res.status(404).json({ message: 'orders not found' })
  }
  res.status(200).json({ message: 'orders found', orders: orders })
})

export default handler
