require('dotenv').config()
const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const Redis = require('ioredis')
const errorHandler = require('./middlewares/errorHandler')
const logger = require('./Utils/logger')
const mediaRoutes = require('./routes/media-routes')
const connectToMongoDB = require('./db/connection')
const { connectToRabbitMQ } = require('./Utils/rabbitmq')
const { consumeEvent } = require('./Utils/rabbitmq')
const {handlePostDeleted} = require('./event-handlers/media-event-handler')

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

app.use('/api/media',mediaRoutes)

app.use(errorHandler);

(async function() {
    try {
        await connectToRabbitMQ()

        // consume all the events 
         await consumeEvent('post.deleted',handlePostDeleted)

        app.listen(port,()=>logger.info(`Server running on port ${port}`))
    } catch(e) {
        logger.error(`Error occured while starting server ${e}`)
        process.exit(1)
    }
})();


process.on('unhandledRejection',(reason,promise)=> {
    logger.error(`Unhandle rejection at ${promise}, reason:${reason}`)
})
