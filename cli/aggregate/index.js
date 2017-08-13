const path = require('path')
const fs = require('fs-extra')
const numeral = require('numeral')

const createSurvey = require('../../src/survey')
const aggregateFolder = require('../../src/aggregation/aggregate-folder')
const aggregateFiles = require('../../src/aggregation/aggregate-files')

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
    const { page, all } = options
    if (all) {
      await aggregateAllCsvFiles({ survey, logger })
    } else {
      await aggregateSingleCsvFile({ survey, logger, page })
    }
    logger.info('THE END')
  } catch (err) {
    logger.error('Unexpected error!', err.stack)
  }
}

async function aggregateAllCsvFiles({ survey, logger }) {
  const folderPath = path.join(process.cwd(), 'output', 'responses')
  const result = await aggregateFolder({ survey, folderPath, logger })
  await writeResult('all', result)
}

async function aggregateSingleCsvFile({ survey, logger, page }) {
  const filename = numberToFilename(page)
  const filepath = path.join(process.cwd(), 'output', 'responses', filename)
  const filepaths = [filepath]
  const result = await aggregateFiles({ survey, filepaths, logger })
  await writeResult(path.join('pages', format(page)), result)
  logger.info('Aggregate only results from', filename)
}

const format = number => `${numeral(number).format('00000')}`

const numberToFilename = page => {
  const number = 1 + (page - 1) * 1000
  return `${format(number)}.csv`
}

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
