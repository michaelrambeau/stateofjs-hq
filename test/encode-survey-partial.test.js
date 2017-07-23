const debug = require('debug')('encode')

const surveyApiResponse = require('./partial-response.json')
const createSurvey = require('../src/survey')
const encode = require('../src/encode-api-response')
const rowToJSON = require('../src/row-to-json')

test('It should encode the response from the API', () => {
  const { questions, responses } = surveyApiResponse
  const survey = createSurvey(['otherTools'])
  expect(responses.length).toBe(1)
  const encoded = encode(survey, questions)(responses[0])
  expect(encoded.length > 0).toBe(true)
  expect(encoded).toEqual([
    '2017-07-17 07:18:25',
    'Singapore',
    'Singapore',
    'desktop',
    'windows',
    'Chrome',
    [0, 1], // NPM and Yarn
    0, // jQuery
    0, // Sublime Text
    0 // "I don't know what that is"
  ])
  const decoded = rowToJSON(survey)(encoded)
  debug('JSON', decoded)
  expect(decoded.length).toBe(10)
  // Check meta values
  expect(decoded[3]).toEqual({ name: 'device', value: 'desktop' })
})
