require('dotenv').config()
const express = require('express')
const logger = require('./Utils/logger')
const helmet = require('helmet')
const cors = require('cors')
const Redis = require('ioredis')
const postRoutes = require('./routes/posts-route')
const errorHandler = require('./middlewares/errorHandler')
const connectToMongoDB = require('./db/connection')

const app = express()
const port = process.env.PORT || 3002
const redisClient = new Redis(process.env.REDIS_URL)

// DbConnection
connectToMongoDB()

// middleware 
app.use(helmet())
app.use(cors())
app.use(express.json())

app.use((req,res,next)=> {
    logger.info(`Recieved ${req.method} req to ${req.url}`)
    logger.info(`Request body ${req.body}`)
    next()
})

// Homework - implement Ip based rate limiting for sensitive endpoints 

// routes -> pass radisclient to routes 
app.use('/api/post',(req,res,next)=> {
    req.redisClient = redisClient 
    next()
},postRoutes)

app.use(errorHandler)

app.listen(port, ()=> logger.info(`Server started at http://localhost:${port}`))

process.on('unhandledRejection',(reason,promise)=> {
    logger.error(`Unhandle rejection at ${promise} reason:${reason}`)
})