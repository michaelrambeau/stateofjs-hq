const debug = require('debug')('encode')

const surveyApiResponse = require('./json/partial-response.json')
const createSurvey = require('../src/survey')
const encode = require('../src/encode-api-response')
const rowToJSON = require('../src/row-to-json')

test('It should encode the response from the API', () => {
  const { questions, responses } = surveyApiResponse
  const survey = createSurvey(['frontend', 'otherTools'])
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
    3,
    2,
    1,
    2,
    3,
    1,
    0,
    1,
    3,
    '',
    3,
    [0, 1, 'PNPM'], // NPM, Yarn,  and PNPM (added manually)
    0, // jQuery
    0, // Sublime Text
    0 // "I don't know what that is"
  ])
  const decoded = rowToJSON(survey)(encoded)
  expect(Object.keys(decoded)).toEqual(['meta', 'answers'])
  // Check meta values
  expect(decoded.meta[3]).toEqual({ name: 'device', value: 'desktop' })
  expect(decoded.answers.frontend[0]).toEqual({
    category: 'frontend',
    key: 'react',
    text: 'React',
    value: 3,
    type: 'knowledge'
  })
  expect(decoded.answers.otherTools[0]).toEqual({
    category: 'otherTools',
    key: 'package-managers',
    text: 'Package Managers',
    value: [0, 1, 'PNPM'],
    type: 'multi'
  })
})
