const fs = require('fs-extra')
const path = require('path')
const aggregateFiles = require('./aggregate-files')

async function aggregateFolder({ survey, folderPath, logger }) {
  const filenames = await fs.readdir(folderPath)
  if (logger)
    logger.info(`${filenames.length} CSV files to process'`, filenames)
  const filepaths = filenames.map(filename => path.join(folderPath, filename))
  return aggregateFiles({ filepaths, survey, logger })
}

module.exports = aggregateFolder
