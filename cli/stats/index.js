const path = require('path')
const fs = require('fs-extra')

const metaSource = require('../../output/aggregations/meta.json')
const { sortByValue } = require('../../src/sort-helpers')
// const answersSource = require('./output/aggregation/meta.json')

async function main(options, logger) {
  const meta = Object.keys(metaSource)
    .map(key => metaSource[key])
    .map(branch => sortByValue(branch))
  await writeJson('meta.json', meta)
  logger.info('THE END', meta)
}

const writeJson = (filename, data) => {
  const filepath = path.join(process.cwd(), 'output', 'dataset', filename)
  return fs.outputJson(filepath, data)
}

module.exports = main
