const questions = require('../survey/questions')
const mapValues = require('lodash.mapvalues')
const flatten = require('lodash.flatten')

const processCategory = (answers, category) => {
  const categoryAnswers = answers[category]
  const { other, happy } = categoryAnswers
  const dataKeys = flatten(
    questions[category]
      .filter(question => question.type === 'knowledge')
      .map(question => question.items)
  ).map(item => item.key)
  const reducer = (acc, val) =>
    Object.assign({}, acc, { [val]: categoryAnswers[val] })
  const data = dataKeys.reduce(reducer, {})
  return {
    data,
    other,
    happy
  }
}

function convert(answers) {
  // const categories = ['frontend', 'backend']
  return mapValues(answers, (value, category) => {
    return processCategory(answers, category)
  })
}

module.exports = convert
