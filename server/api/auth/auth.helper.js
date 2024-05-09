const jwt = require('jsonwebtoken')

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY

function getSessionToken(user) {
  return jwt.sign(
    user,
    JWT_SECRET_KEY,
    {
      expiresIn: '24h'
    }
  )
}

module.exports = {
  getSessionToken,
}