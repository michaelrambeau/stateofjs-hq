const createFileReducer = require('./file-reducer')
const pReduce = require('p-reduce')

async function aggregateFiles({
  survey,
  filepaths,
  responseReducer,
  initialState,
  logger
}) {
  const fileReducer = createFileReducer({ responseReducer, survey, logger })
  return pReduce(filepaths, fileReducer, initialState)
}

module.exports = aggregateFiles
