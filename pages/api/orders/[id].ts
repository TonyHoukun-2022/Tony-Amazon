import nc from "next-connect";
import { NextApiRequest, NextApiResponse } from "next";
import Order from '../../../models/Order';
import connectDB from '../../../utils/db'
import { isAuth } from "../../../utils/auth.js"
import { onError, getError } from "../../../utils/error"

const handler = nc<NextApiRequest, NextApiResponse>({onError, attachParams: true});
//middleware => only authorized user can find order
handler.use(isAuth)

handler.get(async (req, res) => {
 const { id } = req.query
 const order = await Order.findById(id)
 res.status(200).json(order)
})

export default handler