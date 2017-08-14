const debug = require('debug')('survey')
const createSurvey = require('../src/survey')

test('Create a basic survey', () => {
  const survey = createSurvey(['frontend'])
  expect(Object.keys(survey)).toEqual(['questions', 'types', 'meta'])
  expect(Array.isArray(survey.questions)).toBe(true)
  const knowledgeQuestions = survey.questions.filter(
    question => question.type === 'knowledge'
  )
  expect(knowledgeQuestions.length).toBe(9)
})
