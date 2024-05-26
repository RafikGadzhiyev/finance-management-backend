const Transaction = require("./Transaction.model")
const User = require('./../auth/User.model')

const enumsHelper = require('./../../helpers/enum.helper')

async function createTransaction(req, res) {
  try {
    const {
      title,
      description,
      sum,
      type,
      status = enumsHelper.TRANSACTION_STATUS.SUCCESS,
      _receiver,
      _sender,
    } = req.body

    // const _sender = req.user.email

    const createdTransaction = (await Transaction
      .create({
        code: `title_${sum}`,
        title,
        description,
        sum,
        type,
        status,
        _sender,
        _receiver
      }))
      .toJSON()

    await User
      .updateMany(
        {
          email: {
            $in: [
              _sender,
              _receiver
            ]
          }
        },
        {
          $push: {
            '_transactions': createdTransaction.code,
          }
        }
      )

    return res.json({
      transaction: createdTransaction
    })
  }
  catch(err) {
    console.log(err)

    return res.status(500).send('Server error')
  }
}

module.exports = {
  createTransaction
}