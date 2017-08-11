const downloadSinglePage = require('./download-single-page')
const downloadAllPages = require('./download-all-pages')

async function main(opts, logger) {
  const options = Object.assign({}, opts, { logger })
  const envKeys = ['TYPEFORM_API_KEY', 'TYPEFORM_UID']
  envKeys.forEach(key => {
    if (!process.env[key])
      throw new Error(`Specify a valid env. variable: '${key}'`)
  })
  const fn = options.all ? downloadAllPages : downloadSinglePage
  const result = await fn(options)
  logger.info('THE END', result)
}

module.exports = main
