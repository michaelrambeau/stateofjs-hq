/*
==========================================
`aggregate` step of the pipeline (STEP #2)
==========================================
To be run after the `download` step.
Launched by `node cli aggregate` command
Generate `output/aggregate` folder from files inside `output/responses`
by running a huge process of reducing all data from the CSV files
*/

const path = require('path')
const fs = require('fs-extra')
const numeral = require('numeral')

const createSurvey = require('../../src/survey')
const aggregateFolder = require('../../src/aggregation/aggregate-folder')
const aggregateFiles = require('../../src/aggregation/aggregate-files')
const getInitialState = require('../../src/aggregation/initial-state')
const createCountryReducer = require('../../src/aggregation/create-country-reducer')
const createResponseReducer = require('../../src/aggregation/response-reducer')
const numberToFilename = require('../../src/helpers/page-number-to-filename')
const { sortMeta, sortAnswers } = require('../../src/sort-helpers')

async function main(options, logger) {
  try {
    const survey = createSurvey([
      'frontend',
      'flavors',
      'datalayer',
      'backend',
      'testing',
      'css',
      'build',
      'mobile',
      'otherTools',
      'features',
      'opinion',
      'aboutYou'
    ])
    const { page, all, country } = options
    const reducer = createResponseReducer(survey)
    // The "reducer" applied to all responses from all files
    const responseReducer = country ? createCountryReducer(reducer) : reducer
    if (all) {
      await aggregateAllCsvFiles({ survey, logger, responseReducer, country })
    } else {
      await aggregateSingleCsvFile({
        survey,
        logger,
        page,
        responseReducer,
        country
      })
    }
    logger.info('THE END')
  } catch (err) {
    logger.error('Unexpected error!', err.stack)
  }
}

// Aggregate content from ALL files inside the `output/responses` folder
async function aggregateAllCsvFiles({
  survey,
  logger,
  responseReducer,
  country
}) {
  const folderPath = path.join(process.cwd(), 'output', 'responses')
  const initialState = country ? {} : getInitialState()
  const result = await aggregateFolder({
    survey,
    folderPath,
    logger,
    responseReducer,
    initialState
  })
  if (country) {
    await Promise.all(
      Object.keys(result).map(country => {
        writeResult({
          folder: path.join('countries', country),
          data: result[country],
          logger
        })
      })
    )
  } else {
    await writeResult({ folder: 'all', data: result, logger })
  }
}

// Aggregate content from ONE SINGLE file from `output/responses` folder
async function aggregateSingleCsvFile({
  survey,
  logger,
  responseReducer,
  page,
  country
}) {
  const filename = numberToFilename(page)
  const filepath = path.join(process.cwd(), 'output', 'responses', filename)
  const filepaths = [filepath]
  const initialState = country ? {} : getInitialState()
  const result = await aggregateFiles({
    survey,
    filepaths,
    logger,
    responseReducer,
    initialState
  })
  if (country) {
    await Promise.all(
      Object.keys(result).map(country => {
        writeResult({
          folder: path.join('pages', format(page), 'countries', country),
          data: result[country],
          logger
        })
      })
    )
  } else {
    await writeResult({
      folder: path.join('pages', format(page)),
      data: result,
      logger
    })
  }
  logger.info('Aggregate only results from', filename)
}

const format = number => `${numeral(number).format('00000')}`

// Write a single JSON file inside either `meta` or `answers` folder, for a given category
const writeAggData = ({ folder, dataType, category, data, logger }) => {
  const filename = `${category}.json` // E.g. `frontend.json`
  const filepath = path.join(
    process.cwd(),
    'output',
    'aggregations',
    folder,
    dataType,
    filename
  )
  logger.info(`Writing ${filepath}`)
  return fs.outputJson(filepath, data, { spaces: 2 })
}

// Write all JSON files about all categories for a given dataType (either `meta` or `answers`)
const writeDataType = ({ folder, dataType, data, logger }) => {
  return Promise.all(
    Object.keys(data).map(category =>
      writeAggData({ folder, dataType, category, data: data[category], logger })
    )
  )
}

// Write the result on the disk, splitting the content into `meta` and  `answers`
function writeResult({ folder, data, logger }) {
  const sortFn = {
    meta: sortMeta,
    answers: sortAnswers
  }
  return Promise.all(
    Object.keys(sortFn).map(dataType => {
      const sortedData = sortFn[dataType](data[dataType])
      return writeDataType({ folder, dataType, data: sortedData, logger })
    })
  )
}

module.exports = main
