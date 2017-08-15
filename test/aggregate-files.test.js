const debug = require('debug')('csv')
const path = require('path')
const pReduce = require('p-reduce')

const getInitialState = require('../src/aggregation/initial-state')
const createFileReducer = require('../src/aggregation/file-reducer')
const createResponseReducer = require('../src/aggregation/response-reducer')
const createCountryReducer = require('../src/aggregation/create-country-reducer')
const createCommentsReducer = require('../src/aggregation/comments-reducer')
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
  const responseReducer = createResponseReducer(survey)
  const fileReducer = createFileReducer({ survey, responseReducer })
  const filepath = getCsvFilepath('1.csv')
  const initialState = getInitialState()
  return fileReducer(initialState, filepath).then(state => {
    expect(Object.keys(state)).toEqual(['meta', 'answers'])
    expect(state.meta.location).toEqual({ Australia: 1, Singapore: 1 })
    expect(state.meta.browser).toEqual({ Chrome: 2 })
    expect(state.answers.frontend.react).toEqual([0, 0, 0, 2, 0])
    expect(state.answers.frontend.react).toEqual([0, 0, 0, 2, 0])
    expect(state.answers.frontend.other).toEqual({
      preact: 1,
      inferno: 1,
      EMPTY: 1
    })
  })
})

test('Read only the second CSV file', () => {
  const responseReducer = createResponseReducer(survey)
  const fileReducer = createFileReducer({ survey, responseReducer })
  const filepath = getCsvFilepath('2.csv')
  const initialState = getInitialState()
  return fileReducer(initialState, filepath).then(state => {
    expect(Object.keys(state)).toEqual(['meta', 'answers'])
    expect(state.meta.location).toEqual({ Canada: 1, Poland: 1 })
    expect(state.meta.browser).toEqual({ Chrome: 2 })
  })
})

test('Read the 2 files sequentially using `pReduce`', () => {
  const responseReducer = createResponseReducer(survey)
  const fileReducer = createFileReducer({ survey, responseReducer })
  const filepaths = filenames.map(getCsvFilepath)
  const initialState = getInitialState()
  return pReduce(filepaths, fileReducer, initialState).then(state => {
    expect(Object.keys(state)).toEqual(['meta', 'answers'])
    expect(state.meta.location).toEqual({
      Singapore: 1,
      Australia: 1,
      Canada: 1,
      Poland: 1
    })
    expect(state.meta.browser).toEqual({ Chrome: 4 })
  })
})

test('Aggregate the folder content', () => {
  const responseReducer = createResponseReducer(survey)
  const folderPath = path.join('test', 'csv')
  const initialState = getInitialState()
  return aggregateFolder({
    folderPath,
    survey,
    responseReducer,
    initialState
  }).then(state => {
    expect(Object.keys(state)).toEqual(['meta', 'answers'])
    expect(state.meta.location).toEqual({
      EMPTY: 2,
      Australia: 2,
      Canada: 1,
      Germany: 1,
      Poland: 1,
      Russia: 1,
      Singapore: 2,
      Sweden: 1,
      Ukraine: 1,
      'United States': 2
    })
    expect(state.meta.browser).toEqual({ Chrome: 12, Firefox: 2 })
  })
})

test('Read only the first CSV file using the `Country` reducer', () => {
  const responseReducer = createCountryReducer(createResponseReducer(survey))
  const fileReducer = createFileReducer({ survey, responseReducer })
  const filepath = getCsvFilepath('1.csv')
  const initialState = {}
  return fileReducer(initialState, filepath).then(state => {
    expect(Object.keys(state)).toEqual(['Singapore', 'Australia'])
    expect(state.Singapore.answers.frontend.react).toEqual([0, 0, 0, 1, 0])
    expect(state.Singapore.answers.frontend.react).toEqual([0, 0, 0, 1, 0])
  })
})

test('Read only the first CSV file using the `Comments` reducer', () => {
  const responseReducer = createCommentsReducer()
  const fileReducer = createFileReducer({ survey, responseReducer })
  const filepath = getCsvFilepath('1.csv')
  const initialState = { count: 0, data: [] }
  return fileReducer(initialState, filepath).then(state => {
    expect(Object.keys(state)).toEqual(['count', 'data'])
    expect(state).toEqual({ count: 1, data: ['my comment'] })
  })
})
