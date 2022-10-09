import nc from "next-connect";
import { NextApiRequest, NextApiResponse } from "next";
import Order from '../../../models/Order';
import { isAuth } from "../../../utils/auth.js"
import { onError, getError } from "../../../utils/error"

const handler = nc({onError});
//middleware => only authorized user can place an order
handler.use(isAuth)

handler.post(async (req, res) => {
 const newOrder = await Order.create({
    ...req.body,
    user: req.user._id
 })
 res.status(201).json(newOrder)
})

export default handler