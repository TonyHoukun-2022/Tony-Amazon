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
      expiresIn: '10d',
    }
  )
}

const isAuth = async (req, res, next) => {
  const { authorization } = req.headers
  if (authorization && authorization.startsWith('Bearer')) {
    //Bearer xxx => xxx
    const token = authorization.slice(7, authorization.length)
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      //put decoded userInfo into req.user (not allowed in TS)
      req.user = decoded
      next()
    } catch (error) {
      return res.status(401).json({ message: 'token is not valid' })
    }
  } else {
    res.status(401).json({ message: 'Token is not supplied' })
  }
}

const isAdmin = async (req, res, next) => {
  if (req.user.isAdmin) {
    next()
  } else {
    res.status(401).json({ message: 'User is not admin' })
  }
}

export { signToken, isAuth, isAdmin }
