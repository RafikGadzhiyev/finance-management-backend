require('dotenv')
  .config()

const mongoose = require('mongoose')
const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')

const app = express()

const authRoute = require('./server/api/auth')

const {
  PORT
} = require('./server/configs/environment')

process.env.NODE_ENV = process.env.NODE_ENV || 'development'

app.use(
  cors({
    origin: process.env.FRONT_BASE_URL,
    credentials: true,
  })
)
app.use(cookieParser())
app.use(express.json())

app.use(
  '/auth',
  authRoute
)

app.get('/', (req, res) => {
  return res.send('Hello, world!')
})

async function initDatabase() {
  try {
    const clientOptions = {
      serverApi: {
        version: '1',
        strict: true,
        deprecationErrors: true
      }
    };

    await mongoose.connect(
      process.env.DATABASE_URL,
      clientOptions
    )

    // Do we actually need this?
    // await mongoose.connection.db.admin().command({ ping: 1 })

    console.log("Successfully connected to MongoDB!");
  }
  catch(err) {
    // TODO: GLOBAL ERROR HANDLING
    console.error(err)
  }
}

initDatabase()

app
  .listen(
    PORT,
    async () => {
      console.log(`Server is running on ${PORT} port`)
    }
  )

if (process.env.NODE_ENV === 'development') {
  process.on(
    'SIGTERM',
    async () => {
      console.log("Shutting down...")

      await mongoose.disconnect()

      console.log("Database disconnected")

      process.exit(0)
    }
  );

  process.on(
    'SIGINT',
    async () => {
      console.log("Shutting down...")

      await mongoose.disconnect()

      console.log("Database disconnected")

      process.exit(0)
    }
  );
}