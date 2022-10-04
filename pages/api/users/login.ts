import nc from "next-connect";
import bcrypt from 'bcryptjs'
import { NextApiRequest, NextApiResponse } from "next";
import User from '../../../models/User'
import { signToken } from '../../../utils/auth'

const handler = nc<NextApiRequest, NextApiResponse>({attachParams: true});

handler.post(async (req, res) => {
    //use input email to find the user
  const user = await User.findOne({email: req.body.email})
//   compareSync(plainPsd, hashedPsd)
//input password is plaintext, psd stored in db is hash
  if(user && bcrypt.compareSync(req.body.psd, user.password)) {
      //user existed, sign an token with jwt
      const token = signToken(user)
      return res.json({
          token,
          _id: user._id,
          name: user.name,
          email: user.email,
          isAdmin: user.isAdmin,
      })
  } else {
      return res.status(401).send({message: 'Invalid user or password'})
  }
})

export default handler