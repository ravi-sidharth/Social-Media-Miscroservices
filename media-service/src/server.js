require('dotenv').config()
const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const Redis = require('ioredis')
const errorHandler = require('./middlewares/errorHandler')
const logger = require('./Utils/logger')
const mediaRoutes = require('./routes/media-routes')
const connectToMongoDB = require('./db/connection')

const app = express()
const port = process.env.PORT || 3003 

connectToMongoDB()

app.use(express.json())
app.use(cors())
app.use(helmet())

app.use((req,res,next)=> {
    logger.info(`Recieved ${req.method} request to ${req.url}`)
    logger.info(`Request body ${req.body}`)
    next()
})

// *** Homework - implement ip based rate limiting for sensitive endpoints
app.use('/api/media',mediaRoutes)

app.use(errorHandler)

app.listen(port,()=>logger.info(`Server running on port ${port}`))

process.on('unhandledRejection',(reason,promise)=> {
    logger.error(`Unhandle rejection at ${promise}, reason:${reason}`)
})
