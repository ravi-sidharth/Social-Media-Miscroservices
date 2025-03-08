const winston = require('winston')

const logger = winston.createLogger({
    level: process.env.NODE_ENV==='production'?'info':'debug',
    format: winston.format.combine(
        winston.format.json(),
        winston.format.splat(),
        winston.format.colorize(),
        winston.format.errors({stack:true})
    ),
    defaultMeta: { service: 'media-service' },
    transports: [
        new winston.transports.Console({
            format:winston.format.combine(
                winston.format.colorize(),
                winston.format.simple()
            )
        }),
        new winston.transports.File({ filename: 'error.log', level: 'error' }),
        new winston.transports.File({ filename: 'combined.log' }),
    ],
})

module.exports = logger