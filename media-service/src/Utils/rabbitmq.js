const amqp = require('amqplib');
const logger = require('./logger');

let connection = null;
let channel = null;

const EXCHANGE_NAME = 'instagram_events';

async function connectToRabbitMQ() {
    try {
        connection = await amqp.connect(process.env.RABBITMQ_URL);
        channel = await connection.createChannel();

        await channel.assertExchange(EXCHANGE_NAME, 'topic', {durable:false});
        logger.info('RabbitMQ connected successfully')
        return channel

    } catch(e) {
        logger.error(`error occured while connecting rabbitMQ, ${e}`);
    }
}; 

async function publishEvent(routingKey, message) {
    if(!channel) {
        await connectToRabbitMQ()
    }

    channel.publish(EXCHANGE_NAME,routingKey,Buffer.from(JSON.stringify(message)))
    logger.info(`Event Published: ${routingKey}`)
}

async function consumeEvent(routingKey, callback) {
    if (!channel) {
        connectToRabbitMQ()
    }

    const q = await channel.assertQueue('', EXCHANGE_NAME, routingKey)
    channel.consume(q.queue, (msg) => {
        if (msg != null) {
            const content = JSON.parse(msg.content.toString())
            callback(content)
            channel.ack(msg)
        }
    })
}

module.exports = {connectToRabbitMQ, publishEvent,consumeEvent};