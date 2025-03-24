const mongoose = require('mongoose')
const logger = require('../utils/logger')

const mongoConnctedToDB = () => {
   try {
    mongoose.connect(process.env.MONGODB_URL)
    logger.info('Database connected successfully!')
   } catch(e) {
    logger.error('Mongo connection error',e)
   }
}

module.exports = mongoConnctedToDB