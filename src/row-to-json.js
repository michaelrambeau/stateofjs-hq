const debug = require('debug')('decode')

const rowToJSON = survey => row => {
  const count = survey.questions.length
  debug(row)
  return row.slice(0, count).map((item, i) => {
    const question = survey.questions[i]
    const types = survey.types
    return {
      text: question.text,
      answer: decodeValue(item, question, types)
    }
  })
}

function decodeValue(value, question, types) {
  debug('> Decode', value)
  const { type } = question
  const options = types[type]
  switch (type) {
    case 'knowledge':
    case 'happyness':
    case 'feature':
    case 'opinion':
      return options[value] || value
    default:
      return value
  }
}

module.exports = rowToJSON
