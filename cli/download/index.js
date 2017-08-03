const downloadSinglePage = require('./download-single-page')
const downloadAllPages = require('./download-all-pages')

async function main(opts, logger) {
  const options = Object.assign({}, opts, { logger })
  const fn = options.all ? downloadAllPages : downloadSinglePage
  const result = await fn(options)
  logger.info('THE END', result)
}

module.exports = main
