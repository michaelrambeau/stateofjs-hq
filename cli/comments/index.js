const path = require('path')
const fs = require('fs-extra')

const createCommentsReducer = require('../../src/aggregation/comments-reducer')
const aggregateFiles = require('../../src/aggregation/aggregate-files')
const aggregateFolder = require('../../src/aggregation/aggregate-folder')
const numberToFilename = require('../../src/helpers/page-number-to-filename')
const createSurvey = require('../../src/survey')

async function main(options, logger) {
  const { all, page } = options
  const responseReducer = createCommentsReducer()
  const initialState = { count: 0, data: [] }
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

  const result = all
    ? await aggregateAllCsvFiles({
        survey,
        logger,
        page,
        responseReducer,
        initialState
      })
    : await aggregateSingleCsvFile({
        survey,
        logger,
        page,
        responseReducer,
        initialState
      })
  await writeOutput('comments.json')(result)
  logger.info(
    'THE END',
    `Comments file created inside: ${path.join(process.cwd(), 'public')}`
  )
}

function aggregateSingleCsvFile({
  survey,
  logger,
  page,
  responseReducer,
  initialState
}) {
  const filename = numberToFilename(page)
  const filepath = path.join(process.cwd(), 'output', 'responses', filename)
  const filepaths = [filepath]
  return aggregateFiles({
    survey,
    filepaths,
    logger,
    responseReducer,
    initialState
  })
}

function aggregateAllCsvFiles({
  survey,
  logger,
  responseReducer,
  initialState
}) {
  const folderPath = path.join(process.cwd(), 'output', 'responses')
  return aggregateFolder({
    survey,
    folderPath,
    logger,
    responseReducer,
    initialState
  })
}

const writeOutput = filename => data => {
  const filepath = path.join(process.cwd(), 'public', filename)
  return fs.outputJson(filepath, data, { spaces: 2 })
}

module.exports = main
