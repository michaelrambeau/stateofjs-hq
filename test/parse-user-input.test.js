const parse = require('../src/parse-user-input')
const createSurvey = require('../src/survey')

const survey = createSurvey(['frontend'])
const question = survey.questions.find(
  q => q.key === 'other' && q.category === 'frontend'
)

test('Parse user input', () => {
  const input = 'preact'
  const output = parse(question)(input)
  expect(output).toEqual(['preact'])
})

test('Parse user input', () => {
  const input = 'preact xyz inferno cycle.js'
  const output = parse(question)(input)
  expect(output).toEqual(['preact', 'inferno', 'cycle'])
})
