const logger = require("../Utils/logger");
const mongoose = require('mongoose')

const connectToMongoDB = async() => {
    try {
        await mongoose.connect(process.env.MONGODB_URL)
        logger.info('Database connected successfully!')
    } catch(err) {
        logger.error('Error while connection database',err)
    }
}

module.exports = connectToMongoDB