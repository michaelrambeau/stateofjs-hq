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
    null,
    'Singapore',
    'Singapore',
    'desktop',
    'windows',
    'Chrome',
    4,
    1,
    2,
    1,
    4,
    2,
    0,
    2,
    4,
    '',
    3,
    [0, 1, 'PNPM'],
    0,
    0,
    0
  ])
  const decoded = rowToJSON(survey)(encoded)
  expect(Object.keys(decoded)).toEqual(['meta', 'answers'])
  // Check meta values
  expect(decoded.meta.device).toEqual('desktop')
  expect(decoded.answers.frontend.react).toEqual({
    value: 4,
    type: 'knowledge'
  })
  expect(decoded.answers.otherTools['package-managers']).toEqual({
    value: [0, 1, 'PNPM'],
    type: 'multi'
  })
})
