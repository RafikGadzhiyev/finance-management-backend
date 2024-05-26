const express = require('express')

const router = express.Router()

const controller = require('./auth.controller')

router.post(
  '/update_user_session_token',
  controller.updateUserSessionToken
)

router.post(
  '/sign_in',
  controller.signIn
)
router.post(
  '/sign_up',
  controller.signUp
)

module.exports = router