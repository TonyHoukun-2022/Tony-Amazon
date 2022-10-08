import nc from "next-connect";
import { NextApiRequest, NextApiResponse } from "next";
import Order from '../../../models/Order';
import connectDB from '../../../utils/db'
import { isAuth } from "../../../utils/auth.js"
import { onError, getError } from "../../../utils/error"

const handler = nc<NextApiRequest, NextApiResponse>({onError});
handler.use(isAuth)

handler.post(async (req, res) => {
 connectDB()
 const newOrder = await Order.create({
    ...req.body,
    user: req.body.token._id
 })
 res.status(201).json(newOrder)
})

export default handler