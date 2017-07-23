const debug = require('debug')('encode')
const uniq = require('lodash.uniq')
const get = require('lodash.get')

const transformId = require('./helpers/transform-id')
const groupAnswers = require('./helpers/group-answers')

const encodeSurveyResponse = (survey, apiQuestions) => {
  return surveyResponse => {
    const surveyWithIds = Object.assign({}, survey, {
      questions: addQuestionIds(survey.questions, apiQuestions)
    })
    const { questions, types } = surveyWithIds
    const { answers } = surveyResponse
    const groupedAnswers = groupAnswers(answers)
    const encodedAnswers = questions.map(question => {
      const { type, text, id } = question
      const questionId = transformId(id)
      const answer = groupedAnswers[questionId]
      const encoded = answer ? encodeAnswerValue(answer, types, type) : ''
      debug('Question', questionId, text, encoded)
      return encoded
    })
    const meta = survey.meta.reduce(
      (acc, item) =>
        Object.assign({}, acc, { [item.name]: get(surveyResponse, item.path) }),
      {}
    )
    return encodedAnswers.concat(Object.values(meta))
  }
}

function encodeAnswerValue(answer, types, type) {
  const options = types[type]
  switch (type) {
    case 'knowledge':
    case 'happiness':
    case 'feature':
    case 'opinion':
      if (!options) return answer
      return options.indexOf(answer)
    default:
      return formatValue(answer)
  }
}

function formatValue(source) {
  return typeof source === 'string' ? source.replace(/\n/gi, '') : source
}

const doesNotStartWith = prefixes => input => {
  return !prefixes.some(prefix => input.indexOf(prefix) > -1)
}

function addQuestionIds(surveyQuestions, apiQuestions) {
  const ids = uniq(
    apiQuestions
      .map(item => item.id)
      .filter(doesNotStartWith(['statement_', 'group_', 'hidden_']))
      .map(transformId)
  )
  return surveyQuestions.map((q, i) => {
    const id = ids[i]
    return Object.assign({}, q, { id })
  })
}

module.exports = encodeSurveyResponse
