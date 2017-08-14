const createCountryReducer = require('../src/aggregation/create-country-reducer')
const createResponseReducer = require('../src/aggregation/response-reducer')
const createSurvey = require('../src/survey')

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

const reactAnswer = (location, value) => ({
  answers: {
    frontend: {
      react: {
        value,
        type: 'knowledge'
      }
    }
  },
  meta: {
    location
  }
})

test('Country reducer', () => {
  const reducer = createResponseReducer(survey)
  const countryReducer = createCountryReducer(reducer)
  const state = [
    reactAnswer('France', 3),
    reactAnswer('Japan', 3),
    reactAnswer('France', 3),
    reactAnswer('Japan', 0)
  ].reduce(countryReducer, {})
  expect(Object.keys(state)).toEqual(['France', 'Japan'])
  expect(state.France.answers.frontend.react).toEqual([0, 0, 0, 2, 0])
  expect(state.Japan.answers.frontend.react).toEqual([1, 0, 0, 1, 0])
})
