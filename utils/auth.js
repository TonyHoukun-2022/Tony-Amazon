import jwt from 'jsonwebtoken'

// jwt.sign(payload, secretOrPrivateKey, [options, callback])
// (Synchronous) Returns the JsonWebToken as string
const signToken = (user) => {
  return jwt.sign(
    {
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: '30d',
    }
  )
}

export { signToken }
