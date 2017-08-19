const path = require('path')
const fs = require('fs-extra')

const { sortMeta, sortAnswers } = require('../../src/sort-helpers')
const groupQuestions = require('../../src/stats/process-knowledge-questions')

async function main(options, logger) {
  await Promise.all([
    readInput('meta.json').then(sortMeta).then(writeOutput('meta.json')),
    readInput('answers.json')
      .then(sortAnswers)
      .then(groupQuestions)
      .then(writeOutput('answers.json'))
  ])
  logger.info(
    'THE END - ',
    `Statistics generated inside: ${path.join(process.cwd(), 'public')}`
  )
}

const readInput = filename => {
  const filepath = path.join(
    process.cwd(),
    'output',
    'aggregations',
    'all',
    filename
  )
  return fs.readJson(filepath)
}

const writeOutput = filename => data => {
  const filepath = path.join(process.cwd(), 'public', filename)
  return fs.outputJson(filepath, data, { spaces: 2 })
}

module.exports = main
