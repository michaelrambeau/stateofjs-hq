// const debug = require('debug')('csv')
const path = require('path')
const pReduce = require('p-reduce')

const getInitialState = require('../src/aggregation/initial-state')
const createFileReducer = require('../src/aggregation/file-reducer')
const createSurvey = require('../src/survey')
const aggregateFolder = require('../src/aggregation/aggregate-folder')

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

test('Aggregate the folder content', () => {
  const folderPath = path.join('test', 'csv')
  return aggregateFolder({ folderPath, survey }).then(state => {
    expect(Object.keys(state)).toEqual(['meta', 'answers'])
    expect(state.meta.location).toEqual({
      '': 1,
      Australia: 1,
      Canada: 1,
      Germany: 1,
      Poland: 1,
      Russia: 1,
      Singapore: 1,
      Spain: 1,
      Sweden: 1,
      Ukraine: 1,
      'United States': 3,
      undefined: 1
    })
    expect(state.meta.browser).toEqual({ Chrome: 12, Firefox: 2 })
  })
})
