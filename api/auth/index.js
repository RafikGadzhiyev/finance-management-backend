const express = require('express')

const router = express.Router()

const controller = require('./auth.controller')

router.get(
  '/get_up_to_date_user',
  controller.getUpToDateUser
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