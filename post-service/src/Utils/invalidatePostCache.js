const logger = require("./logger");

async function invalidatePostCache(req,input) {
    const cachedPost = `post:${input}`
    await req.redisClient.del(cachedPost)
    
    const keys = await req.redisClient.keys('posts:*')
    if (keys.length > 0) {
        await req.redisClient.del(keys)
    }
}

module.exports = invalidatePostCache