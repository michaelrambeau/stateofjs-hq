const path = require('path')
const fs = require('fs-extra')

const createSurvey = require('../../src/survey')
const aggregateFolder = require('../../src/aggregation/aggregate-folder')

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
    const folderPath = path.join(process.cwd(), 'output', 'responses')
    const result = await aggregateFolder({ survey, folderPath, logger })
    await writeResult(result)
    logger.info('THE END')
  } catch (err) {
    logger.error('Unexpected error!', err.stack)
  }
}

const writeJson = filename => agg => {
  const filepath = path.join(process.cwd(), 'output', 'aggregations', filename)
  return fs.outputJson(filepath, agg)
}

function writeResult(agg) {
  // return await fs.outputJson(filepath, agg)
  return Promise.all(
    Object.keys(agg).map(key => writeJson(`${key}.json`)(agg[key]))
  )
}

module.exports = main
