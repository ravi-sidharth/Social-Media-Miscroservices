const mongoose = require('mongoose')
const logger = require('../Utils/logger')

const connectToMongoDB = async() => {
    try{
        await mongoose.connect(process.env.MONGODB_URL)
        logger.info('Database connected successfully!')
    } catch(err) {
        logger.error('Error occured while connecting database',err)
    }
}

module.exports = connectToMongoDB