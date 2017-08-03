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
    await writeResult(result, 'agg.json')
    logger.info('THE END', result)
  } catch (err) {
    logger.error('Unexpected error!', err.stack)
  }
}

function writeResult(json, filename) {
  const filepath = path.join(process.cwd(), 'output', 'aggregations', filename)
  return fs.writeJson(filepath, json)
}

module.exports = main
