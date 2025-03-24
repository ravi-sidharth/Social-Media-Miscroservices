const logger = require('../Utils/logger')
const Search = require('../models/search')


const searchPostController = async (req, res) => {
    try {
        const {query} = req.query

        const results = await Search.find(
            {
                $text: { $search: query }
            },
            {
                score: { $meta: 'textScore' }
            }
        ).sort({ score: { $meta: 'textScore' } }).limit(10)
        res.json(results)

    } catch (e) {
        logger.error('error occured while searching post', e)
        res.status(500).json({
            message: 'error',
            error: 'error occured while searching post', e
        })
    }
}

module.exports = { searchPostController }