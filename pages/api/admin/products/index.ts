import nc from 'next-connect';
import Product from '../../../../models/Product';
import { NextApiRequest, NextApiResponse } from 'next';
import { isAuth, isAdmin } from '../../../../utils/auth';
import { onError } from '../../../../utils/error';

const handler = nc<NextApiRequest, NextApiResponse>({
  onError,
});

handler.use(isAuth, isAdmin);

handler.get(async (req, res) => {
  const products = await Product.find({});
  res.status(200).json(products);
});

export default handler;