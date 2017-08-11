const path = require('path')
const fs = require('fs-extra')

const metaSource = require('../../output/aggregations/meta.json')
const answersSource = require('../../output/aggregations/answers.json')
const { sortMeta, sortAnswers } = require('../../src/sort-helpers')

async function main(options, logger) {
  const meta = sortMeta(metaSource)
  const answers = sortAnswers(answersSource)
  await Promise.all([
    writeJson('meta.json')(meta),
    writeJson('answers.json')(answers)
  ])
  logger.info('THE END', Object.keys(answers.backend.other).slice(0, 3))
}

const writeJson = filename => data => {
  const filepath = path.join(process.cwd(), 'public', filename)
  return fs.outputJson(filepath, data, { spaces: 2 })
}

module.exports = main
