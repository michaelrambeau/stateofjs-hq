const fs = require('fs-extra')
const path = require('path')
const aggregateFiles = require('./aggregate-files')

// Read data from ALL files in a given folder, aggregate data and return a single Object
// The aggregation is specified with the `responseReducer` (the reducer applied to all responses)
async function aggregateFolder({
  survey,
  folderPath,
  responseReducer,
  initialState,
  logger
}) {
  const filenames = await fs.readdir(folderPath)
  if (logger)
    logger.info(
      `${filenames.length} CSV files to process inside ${folderPath} folder`,
      filenames
    )
  const filepaths = filenames.map(filename => path.join(folderPath, filename))
  return aggregateFiles({
    filepaths,
    survey,
    responseReducer,
    initialState,
    logger
  })
}

module.exports = aggregateFolder
