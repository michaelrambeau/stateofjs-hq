const questions = require('../survey/questions')
const mapValues = require('lodash.mapvalues')
const flatten = require('lodash.flatten')

// Apply 2 transformations to all answers from `answers.json` file.
// * Group all `type="knowledge"` questions under `data` path
// * Clean the `key="other"` question to keep only answers defined in the "keywords" object
function convert(answers) {
  return mapValues(answers, (value, category) => {
    return categoryHasOtherQuestion(category)
      ? processCategory(answers, category)
      : value
  })
}

const getOtherQuestion = category =>
  questions[category].find(question => question.key === 'other')

const categoryHasOtherQuestion = category => !!getOtherQuestion(category)

// Apply the 2 transformations (see above) to a given category
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

// Transformation #2: keep only keywords in the "other" answers
const filterOtherWords = (answerKeywords, category) => {
  // Loop through all `words` for a given question
  // Each word can be either a string of an Object:
  //  { "text": "rails", "query": "rails|ruby on rails" }
  const questionKeywords = getOtherQuestion(category).keywords.map(
    item => item.text || item
  )
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

module.exports = convert
