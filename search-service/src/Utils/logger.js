const winston = require('winston');

const logger = winston.createLogger({
  level: process.env.NODE_ENV==='production'? 'info':'debug',
  format: winston.format.combine(
    winston.format.json(),
    winston.format.splat(),
    winston.format.errors({stack:true}),
    winston.format.colorize()

  ),
  defaultMeta: { service: 'search-service' },
  transports: [
    new winston.transports.Console({
        format: winston.format.combine(
            winston.format.simple(),
            winston.format.colorize()
        )
    }),
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});

module.exports = logger