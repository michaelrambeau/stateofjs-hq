const fs = require('fs-extra')
const path = require('path')
const createFileReducer = require('./file-reducer')
const pReduce = require('p-reduce')
const getInitialState = require('./initial-state')

async function aggregateFolder({ survey, folderPath, logger }) {
  // const folderPath = path.join(process.cwd(), 'output')
  const filenames = await fs.readdir(folderPath)
  if (logger) logger.info('CSV files to process', filenames)
  const fileReducer = createFileReducer(survey, logger)
  const filepaths = filenames.map(filename => path.join(folderPath, filename))
  const initialState = getInitialState()
  return pReduce(filepaths, fileReducer, initialState)
}

module.exports = aggregateFolder
