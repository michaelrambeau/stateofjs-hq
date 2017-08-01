const debug = require('debug')('csv')
const fs = require('fs-extra')
const path = require('path')
const times = require('lodash.times')
const parse = require('../src/parse-csv')
const pReduce = require('p-reduce')

const getInitialState = require('../src/aggregation/initial-state')
const counterReducer = require('../src/aggregation/reducer')
const rowToJSON = require('../src/row-to-json')
const createSurvey = require('../src/survey')

const createFileReducer = survey => async (state, filepath) => {
  const csvRows = await readSingleCsvFile(filepath)
  const jsonRows = csvRows.map(rowToJSON(survey))
  debug(jsonRows[0].answers.otherTools)
  const updatedState = jsonRows.reduce(counterReducer, state)
  return updatedState
}

async function readSingleCsvFile(filepath) {
  debug('Reading', filepath)
  const content = await fs.readFile(filepath)
  const json = await parse(content, { auto_parse: true })
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

test('Read only the first CSV file', () => {
  const fileReducer = createFileReducer(survey)
  const filepath = getCsvFilepath('1.csv')
  const initialState = getInitialState()
  return fileReducer(initialState, filepath).then(state => {
    expect(Object.keys(state)).toEqual(['meta', 'answers'])
    expect(state.meta.location).toEqual({ Spain: 1, 'United States': 1 })
    expect(state.meta.browser).toEqual({ Chrome: 2 })
  })
})

test('Read only the second CSV file', () => {
  const fileReducer = createFileReducer(survey)
  const filepath = getCsvFilepath('2.csv')
  const initialState = getInitialState()
  return fileReducer(initialState, filepath).then(state => {
    expect(Object.keys(state)).toEqual(['meta', 'answers'])
    expect(state.meta.location).toEqual({ Canada: 1, Poland: 1 })
    expect(state.meta.browser).toEqual({ Chrome: 2 })
  })
})

test('Read the 2 files sequentially using `pReduce`', () => {
  const fileReducer = createFileReducer(survey)
  const filepaths = filenames.map(getCsvFilepath)
  const initialState = getInitialState()
  return pReduce(filepaths, fileReducer, initialState).then(state => {
    expect(Object.keys(state)).toEqual(['meta', 'answers'])
    expect(state.meta.location).toEqual({
      Spain: 1,
      'United States': 1,
      Canada: 1,
      Poland: 1
    })
    expect(state.meta.browser).toEqual({ Chrome: 4 })
  })
})
