import nc from 'next-connect';
import { isAdmin, isAuth } from '../../../../../utils/auth';
import { NextApiRequest, NextApiResponse } from 'next';
import Product from '../../../../../models/Product';

const handler = nc<NextApiRequest, NextApiResponse>();
handler.use(isAuth, isAdmin);

handler.get(async (req, res) => {
  const product = await Product.findById(req.query.id);
  res.status(200).json(product);
});
export default handler;