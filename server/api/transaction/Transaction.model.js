const mongoose = require('mongoose')
const Schema = mongoose.Schema

const enumsHelper = require('./../../helpers/enum.helper')

const Transaction = new Schema({
  code: String,
  sum: Number,
  title: String,
  description: String,
  _sender: String,
  _receiver: String,
  status: {
    type: String,
    enum: Object.values(enumsHelper.TRANSACTION_STATUS),
    default: enumsHelper.TRANSACTION_STATUS.PENDING
  },
  type: {
    type: String,
    enum: Object.values(enumsHelper.TRANSACTION_TYPE)
  },
  dtCreated: {
    type: Date,
    default: Date.now
  },
  dtApproved: {
    type: Date,
    default: Date.now,
  }
})

Transaction.virtual(
  'sender',
  {
    localField: '_sender',
    foreignField: 'email',
    ref: 'User'
  }
)

Transaction.virtual(
  'receiver',
  {
    localField: '_receiver',
    foreignField: 'email',
    ref: 'User'
  }
)

module.exports = new mongoose.model('Transaction', Transaction)