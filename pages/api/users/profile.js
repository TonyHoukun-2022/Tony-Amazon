import nc from 'next-connect'
import bcrypt from 'bcryptjs'
import { NextApiRequest, NextApiResponse } from 'next'
import User from '../../../models/User'
import { signToken, isAuth } from '../../../utils/auth'

const handler = nc({ attachParams: true })

//save decoded in req.user
handler.use(isAuth)

//update user profile
handler.put(async (req, res) => {
  const user = await User.findById(req.user._id)

  if (!user) {
    return res.status(404).json({ message: 'user not found' })
  }
  const { name, email, password } = req.body
  //update user
  user.name = name
  user.email = email
  user.password = password ? bcrypt.hashSync(password) : user.password

  await user.save()

  //sign a new token
  const token = signToken(user)
  res.status(203).json({
    token,
    _id: user._id,
    name: user.name,
    email: user.email,
    isAdmin: user.isAdmin,
  })
})

export default handler
