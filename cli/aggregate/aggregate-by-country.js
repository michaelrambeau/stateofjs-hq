/*
Script to aggregate "knowledge" questions and sort them by country

Command:
node cli aggregate --country

Generate one file by `category` E.g. `frontend.json`
"react": {
  "United States": [15, 1458, 486, 3524, 235],
  "United Kingdom": [3, 372, 129, 857, 48],
}
*/
const path = require('path')
const fs = require('fs-extra')
const numeral = require('numeral')

const countries = require('./countries.json')
// const countries = ['France']
const aggregateFiles = require('../../src/aggregation/aggregate-files')
const aggregateFolder = require('../../src/aggregation/aggregate-folder')
const numberToFilename = require('../../src/helpers/page-number-to-filename')

const {
  responseByCountryReducer,
  getInitialState
} = require('../../src/aggregation/by-country')
const questions = require('../../src/survey/questions')

const format = number => `${numeral(number).format('00000')}`

async function aggregateByCountry(options, logger, survey) {
  const { page, all } = options
  const fn = all ? aggregateAllCsvFiles : aggregateSingleCsvFile
  await fn({ logger, page, survey })
  logger.info('THE END')
}

async function aggregateAllCsvFiles({ logger, survey }) {
  const folderPath = path.join(process.cwd(), 'output', 'responses')
  const initialState = getInitialState({
    countries,
    defaultValue: [0, 0, 0, 0, 0],
    questions
  })
  const result = await aggregateFolder({
    survey,
    folderPath,
    logger,
    responseReducer: responseByCountryReducer,
    initialState
  })
  await writeResult({
    folder: path.join('by-country', 'all'),
    data: result,
    logger
  })
}

// Aggregate content from ONE SINGLE file from `output/responses` folder
async function aggregateSingleCsvFile({ logger, page, survey }) {
  const filename = numberToFilename(page)
  const filepath = path.join(process.cwd(), 'output', 'responses', filename)
  const filepaths = [filepath]
  const initialState = getInitialState({
    countries,
    defaultValue: [0, 0, 0, 0, 0],
    questions
  })
  const result = await aggregateFiles({
    survey,
    filepaths,
    logger,
    responseReducer: responseByCountryReducer,
    initialState
  })
  await writeResult({
    folder: path.join('by-country', format(page)),
    data: result,
    logger
  })

  logger.info('Results aggregated from only 1 file', filename)
}

const writeResult = ({ folder, data, logger }) =>
  Promise.all(
    Object.keys(data)
      .filter(key => Object.keys(data[key]).length > 0)
      .map(category =>
        writeAggData({ folder, category, data: data[category], logger })
      )
  )

const writeAggData = ({ folder, category, data, logger }) => {
  const filename = `${category}.json` // E.g. `frontend.json`
  const filepath = path.join(
    process.cwd(),
    'output',
    'aggregations',
    folder,
    filename
  )
  logger.info(`Writing ${filepath}`)
  return fs.outputJson(filepath, data, { spaces: 2 })
}

module.exports = aggregateByCountry
