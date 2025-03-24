require('dotenv').config()
const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const Redis = require('ioredis')
const errorHandler = require('./middleware/errorHandler')
const { rateLimit } = require('express-rate-limit')
const { RedisStore } = require('rate-limit-redis')
const { RateLimiterRedis } = require('rate-limiter-flexible');
const logger = require('./utils/logger')
const proxy = require('express-http-proxy')
const { validateToken } = require('./middleware/authMiddleware')

const app = express()
const port = process.env.PORT || 3000

// Connect redis client 
const redisClient = new Redis(process.env.REDIS_URL)

// connect middleware 
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(cors())
app.use(helmet())


// rate limiting 
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 100,
    standardHeaders: true,
    legacyHeaders: false,
    handler: ((req, res, next) => {
        logger.warn('Your api limit is finished, Try after some time.')
        res.status(423).json({
            success: false,
            message: 'Your api limit is finished, Try after some time.'
        })
    }),
    store: new RedisStore({
        sendCommand: (...args) => redisClient.call(...args),
    }),

})

// apply rate limit on every api 
app.use(limiter)

const rateLimiterRedis = new RateLimiterRedis({
    storeClient: redisClient,
    points: 5,
    duration: 5,
    keyPrefix: 'middleware'
})

app.use((req, res, next) => {
    rateLimiterRedis.consume(req.ip)
        .then(()=>next())
        .catch(() => {
            logger.warn('Your api limit is finished, Try after some time.')
            res.status(429).json({
                success: false,
                message: 'Too many requests'
            })
        })
})

// Setting up proxy for our Identity service
app.use('/v1/auth', proxy(process.env.IDENTITY_SERVICE_URL, {
    proxyReqPathResolver: function (req) {
        const url = req.originalUrl
        return url.replace(/^\/v1/, '/api')
    },
    proxyErrorHandler: (err, res, next) => {
        logger.error('proxy error', err.message)
        return res.status(500).json({
            message: "Internal server error",
            error: err.message
        })
    },
    proxyReqOptDecorator: function (proxyReqOpts, srcReq) {
        proxyReqOpts.headers['Content-Type'] = 'application/json'
        return proxyReqOpts
    },
    userResDecorator: function (proxyRes, proxyResData, userReq, userRes) {
        logger.info('Response recieved from Identity service', proxyRes.statusCode)
        return proxyResData
    },
}))


// Setting up proxy for our Post service
app.use('/v1/post', validateToken, proxy(process.env.POST_SERVICE_URL, {
    proxyReqPathResolver: function (req) {
            const url = req.originalUrl
            return url.replace(/^\/v1/, '/api')
        },

    proxyErrorHandler: function (err, res, next) {
        logger.error(err.message)
        return res.status(err.status || 500).json({
            success: false,
            message: err.message

    })
    },
    proxyReqOptDecorator: function (proxyReqOpts, srcReq) {
        proxyReqOpts.headers['Content-Type'] = 'application/json';
        proxyReqOpts.headers['x-user-id'] = srcReq.user._id;
        return proxyReqOpts;
    },
    userResDecorator: function (proxyRes, proxyResData, userReq, userRes) {
        logger.info('Response recieved from post service', proxyRes.statusCode);
        return proxyResData;
    },

}))

// Setting up proxy for our media service
app.use('/v1/media',validateToken, proxy(process.env.MEDIA_SERVICE_URL, {
    proxyReqPathResolver: function (req) {
        const url = req.originalUrl
        return url.replace(/^\/v1/,'/api')
    },
    proxyErrorHandler: (err, res, next) => {
        logger.error('proxy error', err)
        return res.status(500).json({
            message: "Internal server error",
            error: err.message
        })
    },
    proxyReqOptDecorator: function (proxyReqOpts, srcReq) {
        proxyReqOpts.headers['x-user-id'] = srcReq.user._id;
        if(!srcReq.headers['content-type'].startsWith('multipart/form-data')) {
            proxyReqOpts.headers['Content-Type'] = 'application/json'
        }
        return proxyReqOpts
    },
    userResDecorator: function (proxyRes, proxyResData, userReq, userRes) {
        logger.info('Response recieved from media service', proxyRes.statusCode)
        return proxyResData
    },
    parseReqBody:false ,
}))

// Setting up proxy for our Identity service
app.use('/v1/search',validateToken, proxy(process.env.SEARCH_SERVICE_URL, {
    proxyReqPathResolver: function (req) {
        const url = req.originalUrl
        return url.replace(/^\/v1/,'/api')
    },
    proxyErrorHandler: (err, res, next) => {
        logger.error('proxy error', err)
        return res.status(500).json({
            message: "Internal server error",
            error: err.message
        })
    },
    proxyReqOptDecorator: function (proxyReqOpts, srcReq) {
        proxyReqOpts.headers['Content-Type'] = 'application/json';
        proxyReqOpts.headers['x-user-id'] = srcReq.user._id;
        return proxyReqOpts
    },
    userResDecorator: function (proxyRes, proxyResData, userReq, userRes) {
        logger.info('Response recieved from search service', proxyRes.statusCode)
        return proxyResData
    },
}));

// Globally Error handler 
app.use(errorHandler)

app.listen(port, () => {
    logger.info(`Api Gateway is running on ${port}`)
    logger.info(`Identity Service is running on ${process.env.IDENTITY_SERVICE_URL}`)
    logger.info(`Post Service is running on ${process.env.POST_SERVICE_URL}`)
    logger.info(`Media Service is running on ${process.env.MEDIA_SERVICE_URL}`)
    logger.info(`Seacrch Service is running on ${process.env.SEARCH_SERVICE_URL}`)
    logger.info(`Api Gateway is running on ${process.env.REDIS_URL}`)
})

process.on('unhandledRejection', (reason, promise) => {
    logger.error(`Unhandled rejection at ${promise} reason:${reason}`)
})
