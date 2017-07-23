const debug = require('debug')('decode')
const getQuestionOptions = require('./helpers/get-question-options')

const rowToJSON = survey => row => {
  const count = survey.meta.length
  debug(row.slice(count))
  const meta = decodeMeta(survey, row.slice(0, count))
  const answers = decodeAnswers(survey, row.slice(count))
  return [].concat(meta, answers)
}

function decodeMeta(survey, rowData) {
  return rowData.map((item, i) => {
    const metaDefinition = survey.meta[i]
    return { name: metaDefinition.name, value: item }
  })
}

function decodeAnswers(survey, rowData) {
  return rowData.map((item, i) => {
    const question = survey.questions[i]
    const types = survey.types
    return {
      text: question.text,
      answer: decodeValue(item, question, types)
    }
  })
}

function decodeValue(value, question, types) {
  const options = getQuestionOptions(question, types)
  const decoded = (options && options[value]) || value
  debug('> Decode', value, '=>', decoded)
  return decoded
}

module.exports = rowToJSON
