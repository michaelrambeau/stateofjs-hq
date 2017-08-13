const createFileReducer = require('./file-reducer')
const pReduce = require('p-reduce')
const getInitialState = require('./initial-state')

async function aggregateFiles({ survey, filepaths, logger }) {
  if (logger) logger.info('CSV files to process', filepaths)
  const fileReducer = createFileReducer(survey, logger)
  const initialState = getInitialState()
  return pReduce(filepaths, fileReducer, initialState)
}

module.exports = aggregateFiles
