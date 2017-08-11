const parse = require('../src/parse-user-input')
const createSurvey = require('../src/survey')

const survey = createSurvey(['frontend', 'backend'])
const getQuestion = category =>
  survey.questions.find(q => q.key === 'other' && q.category === category)

test('Parse user input - one keyword found', () => {
  const question = getQuestion('frontend')
  const input = 'preact'
  const output = parse(question)(input)
  expect(output).toEqual(['preact'])
})

test('Parse user input - 3 keywords', () => {
  const question = getQuestion('frontend')
  const input = 'preact xyz inferno cycle.js'
  const output = parse(question)(input)
  expect(output).toEqual(['preact', 'inferno', 'cycle'])
})

test('Parse user input - Golang', () => {
  const question = getQuestion('backend')
  const input = 'go'
  const output = parse(question)(input)
  expect(output).toEqual(['golang'])
})

test('Parse user input - Golang long version', () => {
  const question = getQuestion('backend')
  const input = 'GoLang'
  const output = parse(question)(input)
  expect(output).toEqual(['golang'])
})
