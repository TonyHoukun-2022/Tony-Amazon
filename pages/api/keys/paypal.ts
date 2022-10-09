import { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';
import { isAuth } from '../../../utils/auth';

const handler = nc<NextApiRequest, NextApiResponse>();
handler.use(isAuth);

handler.get(async (req, res) => {
  res.json(process.env.PAYPAL_CLIENT_ID || 'sandbox');
});

export default handler;