const debug = require('debug')('csv')
const fs = require('fs-extra')
const path = require('path')
const csv = require('csv')
const times = require('lodash.times')
const { promisify } = require('util')
const parse = promisify(csv.parse)
const pReduce = require('p-reduce')
// const aggregate = require('../src/aggregate')
const getInitialState = require('../src/aggregation/initial-state')
const counterReducer = require('../src/aggregation/reducer')
const rowToJSON = require('../src/row-to-json')
const createSurvey = require('../src/survey')

const createFileReducer = survey => async (state, filepath) => {
  debug('Reading', filepath)
  const csvRows = await readSingleCsvFile(filepath)
  const jsonRows = csvRows.map(rowToJSON(survey))
  debug('Rows', jsonRows[0].meta)
  const updatedState = jsonRows.reduce(counterReducer, state)
  return updatedState
}

async function processSingleCsvFile(acc = {}, filepath) {
  debug('Reading', filepath)
  const rows = await readSingleCsvFile(filepath)
  const agg = aggregateAllsColumns(acc, rows)
  return agg
}

async function processMultipleCsvFiles(filepaths) {
  return pReduce(filepaths, processSingleCsvFile, {})
}

async function readSingleCsvFile(filepath) {
  const content = await fs.readFile(filepath)
  const json = await parse(content)
  return json
}

const singleFileReducer = (acc, value) => {
  return Object.assign({}, acc, {
    [value]: acc[value] ? acc[value] + 1 : 1
  })
}

function aggregateColumn(acc, rows, columnIndex) {
  return rows.map(row => row[columnIndex]).reduce(singleFileReducer, acc)
}

function aggregateAllsColumns(acc, rows) {
  const indexes = times(rows[0].length).slice(1) // do not include the the 1st index
  return indexes.map(columnIndex => aggregateColumn(acc, rows, columnIndex))
}

const filenames = ['1.csv', '2.csv']

const getCsvFilepath = filename =>
  path.join(process.cwd(), 'test', 'csv', filename)

test('Check low levels aggregation functions', () => {
  const filepaths = filenames.map(getCsvFilepath)
  return readSingleCsvFile(filepaths[0]).then(rows => {
    expect(rows.length).toBe(2)
    expect(rows[0].slice(0, 9)).toEqual([
      '2017-07-18 14:13:25',
      'Spain',
      'Barcelona',
      'desktop',
      'mac',
      'Chrome',
      '3',
      '2',
      '2'
    ])
    expect(rows[1].slice(0, 9)).toEqual([
      '2017-07-18 14:13:28',
      'United States',
      'undefined',
      'mobile',
      'android',
      'Chrome',
      '3',
      '1',
      '1'
    ])
    const countries = aggregateColumn({}, rows, 1)
    const browsers = aggregateColumn({}, rows, 5)
    expect(countries).toEqual({ Spain: 1, 'United States': 1 })
    expect(browsers).toEqual({ Chrome: 2 })
    const agg = aggregateAllsColumns({}, rows)
    expect(agg.length).toBe(rows[0].length - 1)
    expect(agg[0]).toEqual({ Spain: 1, 'United States': 1 })
    expect(agg[4]).toEqual({ Chrome: 2 })
    // console.log(agg)
  })
})

test('Single CSV file reducer', () => {
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
  const fileReducer = createFileReducer(survey)
  const filepath = getCsvFilepath('1.csv')
  const initialState = getInitialState()
  return fileReducer(initialState, filepath).then(state => {
    debug('We got the state', state)
    expect(Object.keys(state)).toEqual(['meta', 'answers'])
  })
})

// test('Read a single file', () => {
//   const initialState = getInitialState()
//   const filepath = path.join(process.cwd(), 'test', 'csv', filenames[0])
//   return processSingleCsvFile({ France: 1, Spain: 1 }, filepath).then(agg => {
//     expect(agg.length).toBe(99)
//     expect(agg[0]).toEqual({ Spain: 2, 'United States': 1, France: 1 })
//     expect(agg[4]).toEqual({ Chrome: 2 })
//   })
// })

// test('Read 2 files sequentially', () => {
//   const filepaths = filenames.map(filename =>
//     path.join(process.cwd(), 'test', 'csv', filename)
//   )
//   return processMultipleCsvFiles(filepaths).then(agg => {
//     expect(agg.length).toBe(99)
//     debug(agg)
//     const countries = agg['0']
//     expect(countries).toEqual({ Spain: 1, 'United States': 1 })
//   })
// })
