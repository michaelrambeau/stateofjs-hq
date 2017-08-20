const debug = require('debug')('parse')

const parseUserInputSurvey = question => input => {
  const words = question.keywords
  const found = words
    ? words.filter(word => {
        const re = new RegExp(word.query || word, 'i')
        return re.test(input)
      })
    : []
  return found.length > 0 ? found.map(word => word.text || word) : input
}

module.exports = parseUserInputSurvey
