const path = require('path')
const fs = require('fs-extra')

const { sortMeta, sortAnswers } = require('../../src/sort-helpers')

async function main(options, logger) {
  await Promise.all([
    readInput('meta.json').then(sortMeta).then(writeOutput('meta.json')),
    readInput('answers.json')
      .then(sortAnswers)
      .then(writeOutput('answers.json'))
  ])
  logger.info(
    'THE END',
    `JSON files generated inside: ${path.join(process.cwd(), 'public')}`
  )
}

const readInput = filename => {
  const filepath = path.join(process.cwd(), 'output', 'aggregations', filename)
  return fs.readJson(filepath)
}

const writeOutput = filename => data => {
  const filepath = path.join(process.cwd(), 'public', filename)
  return fs.outputJson(filepath, data, { spaces: 2 })
}

module.exports = main
