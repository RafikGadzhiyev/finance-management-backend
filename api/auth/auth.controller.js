const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const User = require('./User.model')

const authHelper = require('./auth.helper')

const SALT = +process.env.SALT_ROUNDS
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY

async function getUpToDateUser(req, res) {
  try {
    const token = req.cookies.authToken

    const user = jwt.verify(token, JWT_SECRET_KEY)

    delete user.iat
    delete user.exp

    const refreshedToken = authHelper
      .getSessionToken(user)

    res.cookie(
      'authToken',
      refreshedToken,
      {
        maxAge: 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: true,
        secure: true,
      }
    )

    return res.json({
      user
    })
  }
  catch(err) {
    console.error(err)

    return res
      .status(401)
      .send({
        error: 'Unauthorized',
        description: "Token expired!"
      })
  }
}

async function signIn(req, res) {
  try {
    const {
      email,
      password
    } = req.body

    const user = await User
      .findOne({
        email: email
      })
      .lean()

    if (!user) {
      return res.status(401).send('Unauthorized')
    }

    const isMatch = bcrypt.compareSync(password, user.password)

    if (!isMatch) {
      return res.status(401).send('Incorrect credentials')
    }

    const token = authHelper
      .getSessionToken(user)

   res.cookie(
    'authToken',
    token,
    {
      maxAge: 24 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: true,
      secure: true,
    }
  )

    return res.json({
      user
    })
  }
  catch(err) {
    console.error(err)

    return res.status(500)
  }
}

async function signUp(req, res) {
  try {
    const {
      email,
      name,
      password,
    } = req.body

    const MIN_PASSWORD_LENGTH = 8

    if (password.length < MIN_PASSWORD_LENGTH) {
      return res
        .status(401)
        .send({
          error: "Weak password",
          description: 'Password must be at least 8 characters long'
        })
    }

    const user = await User.findOne({
      email,
    })

    if (user) {
      return res
        .status(400)
        .json({
          error: 'Bad request',
          description: 'User with such email exists'
        })
    }

    const hashedPassword = bcrypt.hashSync(password, SALT)

    const newUser = (await User.create({
      email,
      name,
      password: hashedPassword,
    }))
    .toObject()

    if (!newUser) {
      return res
        .status(500)
        .json({
          error: 'Internal server error',
          description: 'Failed to create user'
        })
    }

    const token = authHelper
      .getSessionToken(newUser)

    res.cookie(
      'token',
      token,
      {
        maxAge: 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: true,
        secure: true,
      }
    )

    return res.json({
      user: newUser
    })
  }
  catch(err) {
    console.error(err)

    return res.status(500)
  }
}

module.exports = {
  getUpToDateUser,
  signIn,
  signUp
}