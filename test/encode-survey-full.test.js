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
  expect(decoded.answers.frontend[0]).toEqual({
    category: 'frontend',
    key: 'react',
    text: 'React',
    value: 3,
    type: 'knowledge'
    // answer: "I've USED it before, and WOULD use it again"
  })
  expect(decoded.answers.frontend[1]).toEqual({
    category: 'frontend',
    text: 'Angular',
    key: 'angular-1',
    value: 2,
    type: 'knowledge'
    // answer: "I've HEARD of it, and am NOT interested"
  })
  expect(decoded.answers.flavors[1]).toEqual({
    category: 'flavors',
    text: 'ES6',
    key: 'es6',
    value: 3,
    type: 'knowledge'
    // answer: "I've USED it before, and WOULD use it again"
  })
  expect(decoded.answers.datalayer[1]).toEqual({
    category: 'datalayer',
    key: 'redux',
    text: 'Redux',
    value: 1,
    type: 'knowledge'
  })
  expect(decoded.answers.backend[1]).toEqual({
    category: 'backend',
    key: 'express',
    text: 'Express',
    value: 3,
    type: 'knowledge'
  })
  expect(decoded.answers.testing[3]).toEqual({
    category: 'testing',
    key: 'jest',
    text: 'Jest',
    value: 1,
    type: 'knowledge'
  })
  expect(decoded.answers.css[4]).toEqual({
    category: 'css',
    key: 'css-in-js',
    text: 'CSS-in-JS',
    value: 3,
    type: 'knowledge'
  })
  expect(decoded.answers.build[5]).toEqual({
    category: 'build',
    key: 'rollup',
    text: 'Rollup',
    value: 1,
    type: 'knowledge'
  })
  expect(decoded.answers.mobile[5]).toEqual({
    category: 'mobile',
    key: 'electron',
    text: 'Electron',
    value: 2,
    type: 'knowledge'
  })
  expect(decoded.answers.otherTools[0]).toEqual({
    category: 'otherTools',
    key: 'package-managers',
    text: 'Package Managers',
    value: [0, 1, 'PNPM'],
    type: 'multi'
  })
  expect(decoded.answers.otherTools[3]).toEqual({
    category: 'otherTools',
    key: 'lint',
    text: 'Code Linters',
    value: [0, 'megalint'],
    type: 'multi'
  })
  expect(decoded.answers.features[2]).toEqual({
    category: 'features',
    key: 'optimistic',
    text: 'Optimistic Updates',
    value: 0,
    type: 'feature'
  })
  expect(decoded.answers.opinion[6]).toEqual({
    category: 'opinion',
    key: 'too-long',
    text: 'This survey is too damn long!',
    value: 2,
    type: 'opinion'
  })
})
