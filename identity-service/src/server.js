require('dotenv').config()
const express = require('express')
const helmet = require('helmet')
const cors = require('cors')
const {RateLimiterRedis} = require('rate-limiter-flexible')
const Redis = require('ioredis')
const {rateLimit} = require('express-rate-limit')
const {RedisStore} = require('rate-limit-redis')
const errorHandler = require('./middlewares/errorHandler')
const useRouter = require('./routes/identity-service')
const mongoConnctedToDB = require('./db/db.connection')
const logger = require('./utils/logger')

const app = express()
const Port = process.env.PORT || 3001

// mongoDB connection function
mongoConnctedToDB()

// Redis client server 
const redisClient = new Redis(process.env.REDIS_URL)

// middlewares 
app.use(helmet())
app.use(cors())
app.use(express.json())

app.use((req,res,next)=> {
    logger.info(`Reciever ${req.method} request to ${req.url}`)
    logger.info(`Request body,${req.body}`)
    next()
})

// Ddos protection  and rate limiting 
const rateLimiter = new RateLimiterRedis({
    storeClient:redisClient,
    keyPrefix: 'middleware',
    points:100,
    duration:60 
})

app.use((req,res,next)=> {
    rateLimiter.consume(req.ip)
    .then(()=> next())
    .catch(()=> {
        logger.warn(`Rate limit exceeded for IP:${req.ip}`)
        res.status(429).json({
            success:false,
            message:'Too many requests'

        })  
    })
})

// Ip based rate limiting for sensitive endpoints
const sensitiveEndpointLimiter = rateLimit({
    windowMs:10*60*1000,
    limit:100,
    standardHeaders:true,
    legacyHeaders:false,
    handler: ((req,res)=> {
        logger.warn(`Sensitive rate limit exceeded for IP: ${req.ip}`)
        res.status(429).json({
            success:false,
            message:'Too many requests'
        })
    }),
    store: new RedisStore({
        sendCommand:(...args)=>redisClient.call(...args)
    })
})
app.use('/api/auth/register',sensitiveEndpointLimiter)

app.use('/api/auth',useRouter)

// error handler
app.use(errorHandler)

app.listen(Port, ()=> logger.info(`Identity Server Started at http://localhost:${Port}`))

// unhandled promise rejection
process.on('unhandledRejection',(reason,promise)=>{
    logger.error(`Unhadled Rejection at, ${promise} reason:${reason}`)
})