const debug = require('debug')('encode')

const surveyApiResponse = require('./api-response.json')
const createSurvey = require('../src/survey')
const encode = require('../src/encode-api-response')
const rowToJSON = require('../src/row-to-json')

test('It should encode the response from the API', () => {
  const { questions, responses } = surveyApiResponse
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
  expect(responses.length).toBe(1)
  const encoded = encode(survey, questions)(responses[0])
  expect(encoded.length > 0).toBe(true)
  expect(encoded.slice(0, 16)).toEqual([
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
    ''
  ])

  const decoded = rowToJSON(survey)(encoded)
  debug(decoded)
  expect(decoded[6]).toEqual({
    text: 'React',
    answer: "I've USED it before, and WOULD use it again"
  })
  expect(decoded[7]).toEqual({
    text: 'Angular',
    answer: "I've HEARD of it, and am NOT interested"
  })
})
