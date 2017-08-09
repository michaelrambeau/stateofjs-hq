const debug = require('debug')('parse')

const parseUserInputSurvey = question => input => {
  const words = question.words
  const found = words
    ? words.filter(word => {
        const re = new RegExp(word, 'i')
        return re.test(input)
      })
    : []
  return found.length > 0 ? found : input
}

module.exports = parseUserInputSurvey
