/*
=============================
`STATS` step of the pipeline
=============================
To be run after the `AGGREGATE` step.
Launched by `node cli stats` command
Goal: generate ligher files from aggregated files,
using "shortlist" of keywords to compact the `other` answers.
*/
const path = require('path')
const fs = require('fs-extra')

const { compactAllJsonFiles } = require('../../src/stats/compact-other')
const questions = require('../../src/survey/questions')

async function main(options, logger) {
  const inputFolderPath = path.join(
    process.cwd(),
    'output',
    'aggregations',
    'all',
    'answers'
  )
  const outputFolderPath = path.join(
    process.cwd(),
    'output',
    'stats',
    'all',
    'answers'
  )
  const compactData = await compactAllJsonFiles({
    inputFolderPath,
    questionKey: 'other',
    questions
  })
  await writeAllFiles(compactData, outputFolderPath, logger)
  logger.info('THE END')
}

// Create all files inside `output/stats/answers` folder
// 1 file by question category: `frontend.json`, `backend.json`
const writeAllFiles = (data, folderPath, logger) => {
  Object.keys(data).map(category => {
    const filepath = path.join(folderPath, `${category}.json`)
    logger.info('Writing', filepath)
    return fs.outputJson(filepath, data[category], { spaces: 2 })
  })
}

module.exports = main
