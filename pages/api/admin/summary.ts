import nc from 'next-connect';
import Order from '../../../models/Order';
import Product from '../../../models/Product';
import User from '../../../models/User';
import { isAuth } from '../../../utils/auth';
import { onError } from '../../../utils/error';
import { NextApiRequest, NextApiResponse } from 'next';

const handler = nc<NextApiRequest, NextApiResponse>({onError})
handler.use(isAuth)

handler.get(async(req, res)=>{
  const ordersCount = await Order.countDocuments() //count number of orders 
  const productsCount = await Product.countDocuments()
  const usersCount = await User.countDocuments()
  //https://www.mongodb.com/docs/v6.0/reference/operator/aggregation/group/
  /** SELECT Sum(totalPrice) AS totalSalesAmount
   *  FROM orders
  */
 /**
  * return {
  *   "_id":null,
  *   "totalSalesAmount": XXX
  * }
  */
  const ordersPriceGroup = await Order.aggregate([
    {
      $group: {
        _id: null,
        totalSalesAmount: {$sum: '$totalPrice'}
      }
    }
  ])
  
  const totalSalesAmount = ordersPriceGroup.length === 1 ? ordersPriceGroup[0].totalSalesAmount :0
  const salesData = await Order.aggregate([
   {
    $group: {
        //group by createdAt on daily basis
      _id: { $dateToString: {format: '%d-%m-%Y', date: "$createdAt"}},
      totalSalesAmountByDay: {$sum: "$totalPrice"}
    }
   }
  ])
  res.status(200).json({
    ordersCount,
    productsCount,
    usersCount,
    totalSalesAmount,
    salesData
  })
})

export default handler