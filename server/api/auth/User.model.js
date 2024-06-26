const mongoose = require('mongoose')

const {
  USER_PLANS
} = require('./../../helpers/enum.helper')

const Schema = mongoose.Schema

const UserSchema = new Schema({
  name: String,
  email: {
    type: String,
    unique: true,
  },
  userPlan: {
    type: String,
    enum: Object.values(USER_PLANS),
    default: USER_PLANS.FREE
  },
  password: String,
  paymentSpecific: {
    country: String,
    currency: String,
  },
  _transactions: [String],
  dtCreated: {
    type: Date,
    default: Date.now
  },
  dtUpdated: {
    type: Date,
    default: Date.now
  },
  dtPremiumStart: {
    type: Date
  }
})


UserSchema.pre(
  ['updateMany', 'updateOne', 'findOneAndUpdate'],
  function(next) {
    this.dtUpdated = Date.now()

    return next()
  }
)

UserSchema.virtual(
  'transactions',
  {
    localField: "_transactions",
    foreignField: "code",
    ref: "Transaction",
    justOne: false
  }
)

module.exports = new mongoose.model('User', UserSchema)