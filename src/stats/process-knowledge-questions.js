const questions = require('../survey/questions')
const mapValues = require('lodash.mapvalues')
const flatten = require('lodash.flatten')

const getOtherQuestion = category =>
  questions[category].find(question => question.key === 'other')

const categoryHasOtherQuestion = category => !!getOtherQuestion(category)

const processCategory = (answers, category) => {
  const categoryAnswers = answers[category]
  const { other, happy } = categoryAnswers
  const otherClean = filterOtherWords(other, category)
  const dataKeys = flatten(
    questions[category]
      .filter(question => question.type === 'knowledge')
      .map(question => question.items)
  )
    .filter(item => !!answers[category][item.key])
    .map(item => item.key)
  const reducer = (acc, val) =>
    Object.assign({}, acc, { [val]: categoryAnswers[val] })
  const data = dataKeys.reduce(reducer, {})
  return {
    data,
    others_clean: otherClean,
    happy
  }
}

const filterOtherWords = (answerKeywords, category) => {
  const questionKeywords = getOtherQuestion(category).words
  return questionKeywords
    ? Object.keys(answerKeywords)
        .filter(value => questionKeywords.includes(value))
        .reduce(
          (acc, val) =>
            Object.assign({}, acc, {
              [val]: answerKeywords[val]
            }),
          {}
        )
    : answerKeywords
}

function convert(answers) {
  return mapValues(answers, (value, category) => {
    return categoryHasOtherQuestion(category)
      ? processCategory(answers, category)
      : value
  })
}

module.exports = convert
