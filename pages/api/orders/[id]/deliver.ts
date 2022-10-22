import nc from 'next-connect';
import Order from '../../../../models/Order';
import { NextApiRequest, NextApiResponse } from 'next';
import { onError } from '../../../../utils/error';
import { isAuth } from '../../../../utils/auth';

const handler = nc<NextApiRequest, NextApiResponse >({
  onError,
});

handler.use(isAuth);

handler.put(async (req, res) => {  
  const order = await Order.findById(req.query.id);
  if (order) {
    order.isDelivered = true;
    order.deliveredAt = new Date(Date.now()).toLocaleString('en-AU').split(',')[0]
    const deliveredOrder = await order.save();
    res.status(201).json({ message: 'order delivered', order: deliveredOrder });
  } else {
    res.status(404).send({ message: 'order not found' });
  }
});

export default handler;