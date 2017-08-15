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
        writeResult(path.join('countries', country), result[country])
      })
    )
  } else {
    await writeResult('all', result)
  }
}

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
        writeResult(
          path.join('pages', format(page), 'countries', country),
          result[country]
        )
      })
    )
  } else {
    await writeResult(path.join('pages', format(page)), result)
  }
  logger.info('Aggregate only results from', filename)
}

const format = number => `${numeral(number).format('00000')}`

const writeJson = (folder, filename) => agg => {
  const filepath = path.join(
    process.cwd(),
    'output',
    'aggregations',
    folder,
    filename
  )
  return fs.outputJson(filepath, agg)
}

function writeResult(folder, agg) {
  return Promise.all(
    Object.keys(agg).map(key => writeJson(folder, `${key}.json`)(agg[key]))
  )
}

module.exports = main
