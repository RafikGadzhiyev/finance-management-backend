const express = require('express')
const router = express.Router()

const controller = require('./transaction.controller')

router.post(
  '/create',
  controller.createTransaction
)

module.exports = router