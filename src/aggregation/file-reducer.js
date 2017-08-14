const debug = require('debug')('reducer')
const fs = require('fs-extra')

const rowToJSON = require('../row-to-json')
const parse = require('../parse-csv')

async function readSingleCsvFile(filepath) {
  debug('Reading', filepath)
  const content = await fs.readFile(filepath)
  const json = await parse(content, { auto_parse: true })
  return json
}

const createFileReducer = ({ survey, logger, responseReducer }) => async (
  state,
  filepath
) => {
  if (logger) logger.info('Reading', filepath)
  const csvRows = await readSingleCsvFile(filepath)
  const jsonRows = csvRows.map(rowToJSON(survey))
  const updatedState = jsonRows.reduce(responseReducer, state)
  return updatedState
}

module.exports = createFileReducer
