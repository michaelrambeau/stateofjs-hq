const groupBy = require('lodash.groupby')
const mapValues = require('lodash.mapvalues')

const transformId = require('./transform-id')

// function isMultiChoiceQuestion(item) {
//   const id = item[0].id
//   return transformId(id) !== id
// }

function groupAnswers(apiAnswers) {
  const answerList = Object.keys(apiAnswers)
    .map(key => ({ id: key, value: apiAnswers[key] }))
    .map(item => Object.assign({}, item, { key: transformId(item.id) }))
  const grouped = groupBy(answerList, item => item.key)
  const result = mapValues(
    grouped,
    item => (item.length > 1 ? item.map(item => item.value) : item[0].value)
  )
  return result
}

module.exports = groupAnswers
