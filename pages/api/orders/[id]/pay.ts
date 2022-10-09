import nc from "next-connect";
import { NextApiRequest, NextApiResponse } from "next";
import Order from '../../../../models/Order';
import { isAuth } from "../../../../utils/auth.js"
import { onError, getError } from "../../../../utils/error"

const handler = nc<NextApiRequest, NextApiResponse>({onError, attachParams: true});
//middleware => only authorized user can find order
handler.use(isAuth)

handler.put(async (req, res) => {
 const { id } =req.query
 const{id:payId, status, payer: {email_address}} = req.body
//  console.log(req.body, 'body')
 const order = await Order.findById(id)
 if(order) {
    //update order
    order.isPaid = true
    order.paidAt = new Date(Date.now()).toLocaleString('en-AU').split(',')[0]
    //new field of order
    order.paymentResult = {
        id: payId,
        status,
        email: email_address,
    }
    const paidOrder = await order.save()
    res.status(201).json({
        message: 'order paid',
        order: paidOrder
    })
 } else {
    res.status(404).json({
        message: 'order not found'
    })
 }
})

export default handler