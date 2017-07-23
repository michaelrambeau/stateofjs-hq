const debug = require('debug')('encode')
const uniq = require('lodash.uniq')
const get = require('lodash.get')

const transformId = require('./helpers/transform-id')
const groupAnswers = require('./helpers/group-answers')
const getQuestionOptions = require('./helpers/get-question-options')

const encodeSurveyResponse = (survey, apiQuestions) => {
  return surveyResponse => {
    const surveyWithIds = Object.assign({}, survey, {
      questions: addQuestionIds(survey.questions, apiQuestions)
    })
    const { questions, types } = surveyWithIds
    const { answers } = surveyResponse
    const groupedAnswers = groupAnswers(answers)
    const answerValues = questions.map(question => {
      const { type, text, id } = question
      const questionId = transformId(id)
      const answer = groupedAnswers[questionId]
      const encoded = answer ? encodeAnswerValue(answer, question, types) : ''
      // debug('Question', questionId, text, encoded)
      return encoded
    })
    const metaValues = encodeMetaFields(survey, surveyResponse)
    const values = [].concat(metaValues, answerValues)
    debug(values)
    return values
  }
}

// Read meta fields definition ([{name: "", path: ""},...]) and return the array of values
const encodeMetaFields = (surveyDefinition, surveyResponse) =>
  Object.values(
    surveyDefinition.meta.reduce(
      (acc, item) =>
        Object.assign({}, acc, { [item.name]: get(surveyResponse, item.path) }),
      {}
    )
  )

function encodeAnswerValue(answer, question, types) {
  const options = getQuestionOptions(question, types)
  const convert = value =>
    options ? options.indexOf(value) : formatValue(value)
  const encoded = Array.isArray(answer) ? answer.map(convert) : convert(answer)
  debug('Encode answer', answer, '=>', encoded, options)
  return encoded
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
