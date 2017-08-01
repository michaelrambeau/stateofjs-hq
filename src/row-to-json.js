const debug = require('debug')('decode')
const groupBy = require('lodash.groupby')
const getQuestionOptions = require('./helpers/get-question-options')

const rowToJSON = survey => row => {
  const count = survey.meta.length
  const meta = decodeMeta(survey, row.slice(0, count))
  const answers = decodeAnswers(survey, row.slice(count))
  return { meta, answers }
}

function decodeMeta(survey, rowData) {
  return rowData.reduce((acc, item, i) => {
    const metaDefinition = survey.meta[i]
    return Object.assign({}, acc, { [metaDefinition.name]: item })
  }, {})
}

function decodeAnswers(survey, rowData) {
  // return rawData.reduce((acc, item, i) => {
  //   const question = survey.questions[i]
  // })
  const flatList = rowData.map((item, i) => {
    const question = survey.questions[i]
    // const types = survey.types
    return {
      text: question.text,
      category: question.category,
      key: question.key,
      value: item,
      type: question.type
      // answer: decodeValue(item, question, types)
    }
  })
  const byCategory = groupBy(flatList, item => item.category)
  return byCategory
}

function decodeValue(value, question, types) {
  const options = getQuestionOptions(question, types)
  const decoded = (options && options[value]) || value
  debug('> Decode', value, '=>', decoded)
  return decoded
}

module.exports = rowToJSON
