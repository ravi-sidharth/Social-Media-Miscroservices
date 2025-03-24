require('dotenv').config()
const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const errorHandler = require('./middlewares/errorHandler')
const connectToMongoDB = require('./db/connection')
const logger = require('./Utils/logger')
const { connectToRabbitMQ, consumeEvent } = require('./Utils/rabbitmq')
const { handlePostCreated, handlePostDeleted } = require('./event-handlers/search-event-handler')
const searchRoutes = require('./routes/search')

const app = express();
const port = process.env.PORT || 3004;

// MongoDB connection
connectToMongoDB()

app.use(cors())
app.use(helmet())
app.use(express.json())

app.use((req,res,next)=> {
    logger.info(`Recieved ${req.method} request to ${req.url}`)
    logger.info(`Request body ${req.body}`)
    next()
})

app.use('/api/search',searchRoutes);

(async()=> {
    try{
        await connectToRabbitMQ()

        // consume the events/ subscribe to the event 
        await consumeEvent('post.created',handlePostCreated)
        await consumeEvent('post.deleted',handlePostDeleted)

        app.listen(port,()=>logger.info(`Server started at Port:${port}`))
    } catch(err) {
        logger.error('Error occured while starting server',err)
        process.exit(1)
    }
})();

app.use(errorHandler)

process.on('unhandledRejection',(err,promise)=> {
    logger.error(`Unhandle rejection at ${promise} reason ${err}`)
})
