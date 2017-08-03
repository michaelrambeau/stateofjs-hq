const debug = require('debug')('download')
const downloadAll = require('../../src/download-all')
const downloadSinglePage = require('./download-single-page')

function downloadAllPages({ start, limit, logger }) {
  logger.info('Start download all responses')
  const download = ({ start, limit }) =>
    downloadSinglePage({ start, limit, logger })
  return downloadAll({ start, limit, download })
}

module.exports = downloadAllPages
