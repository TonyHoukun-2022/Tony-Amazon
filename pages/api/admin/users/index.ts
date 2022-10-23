import nc from 'next-connect';
import { NextApiRequest, NextApiResponse } from 'next';
import { isAdmin, isAuth } from '../../../../utils/auth';
import User from '../../../../models/User';

const handler = nc<NextApiRequest,NextApiResponse >();
handler.use(isAuth, isAdmin);

handler.get(async (req, res) => {
  const users = await User.find({});
  res.status(200).json(users);
});

export default handler;