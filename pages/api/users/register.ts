import nc from "next-connect";
import bcrypt from 'bcryptjs'
import { NextApiRequest, NextApiResponse } from "next";
import User from '../../../models/User'
import { signToken } from '../../../utils/auth'

const handler = nc<NextApiRequest, NextApiResponse>({attachParams: true});

handler.post(async (req, res) => {
  const { name, email, password } = req.body
  const newUser = await User.create({
      name,
      email,
      password: bcrypt.hashSync(password, 10),
      isAdmin: false,
  })
  const token = signToken(newUser)
  res.json({
      token,
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      isAdmin: newUser.isAdmin,
  })
})

export default handler