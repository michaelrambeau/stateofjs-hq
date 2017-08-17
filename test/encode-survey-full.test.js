const debug = require('debug')('encode')

const surveyApiResponse = require('./json/api-response.json')
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
  expect(encoded.slice(0, 17)).toEqual([
    '2017-07-17 07:18:25',
    'https://t.co/WCILY6Ni6R?xxx',
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
    ''
  ])

  const decoded = rowToJSON(survey)(encoded)
  expect(decoded.answers.frontend.react).toEqual({
    value: 4,
    type: 'knowledge'
  })
  expect(decoded.answers.frontend['angular-1']).toEqual({
    value: 1,
    type: 'knowledge'
  })
  expect(decoded.answers.flavors.es6).toEqual({
    value: 4,
    type: 'knowledge'
  })
  expect(decoded.answers.datalayer.redux).toEqual({
    value: 2,
    type: 'knowledge'
  })
  expect(decoded.answers.backend.express).toEqual({
    value: 4,
    type: 'knowledge'
  })
  expect(decoded.answers.testing.jest).toEqual({
    value: 2,
    type: 'knowledge'
  })
  expect(decoded.answers.css['css-in-js']).toEqual({
    value: 4,
    type: 'knowledge'
  })
  expect(decoded.answers.build.rollup).toEqual({
    value: 2,
    type: 'knowledge'
  })
  expect(decoded.answers.mobile.electron).toEqual({
    value: 1,
    type: 'knowledge'
  })
  expect(decoded.answers.otherTools['package-managers']).toEqual({
    value: [0, 1, 'PNPM'],
    type: 'multi'
  })
  expect(decoded.answers.otherTools['lint']).toEqual({
    value: [0, 'megalint'],
    type: 'multi'
  })
  expect(decoded.answers.features.optimistic).toEqual({
    value: 0,
    type: 'feature'
  })
  expect(decoded.answers.opinion['too-long']).toEqual({
    value: 2,
    type: 'opinion'
  })
  expect(decoded.answers.aboutYou.experience).toEqual({
    value: 2,
    type: 'single'
  })
  expect(decoded.answers.aboutYou.salary).toEqual({
    value: 2,
    type: 'single'
  })
  expect(decoded.answers.aboutYou.tabs).toEqual({
    value: 0,
    type: 'single'
  })
  expect(decoded.answers.aboutYou.from).toEqual({
    value: 'http://stateofjs.com/',
    type: 'text'
  })
})
