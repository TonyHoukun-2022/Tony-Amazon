import nc from 'next-connect';
import Order from '../../../models/Order';
import { NextApiRequest, NextApiResponse } from 'next';
import { isAuth, isAdmin } from '../../../utils/auth';
import { onError } from '../../../utils/error';

const handler = nc<NextApiRequest, NextApiResponse>({
  onError,
});
handler.use(isAuth, isAdmin);

handler.get(async (req, res) => {
  //populate replace the specific path in the document with document(s) from other collection(s)
  //populate 将该user的name填充到user field of this Order
  const orders = await Order.find({}).populate('user', 'name');
  res.status(200).json(orders);
});

export default handler;