const debug = require('debug')('parse')

// Parse user answer to a given question
// using question "keywords" to search for several terms related to a given keyword
// Example of question: (see `src/survey/*.json` files):
// {
//  "key": "other",
//  "text": "Other Front-End Frameworks",
//  "keywords": [{ "text": "preact", "shortlist": true }]
// }
// Return the array of found keywords
const parseUserInputSurvey = question => input => {
  const words = question.keywords
  const found = words
    ? words.filter(word => {
        const re = new RegExp(word.query || word.text || word, 'i')
        return re.test(input)
      })
    : []
  return found.length > 0 ? found.map(word => word.text || word) : input
}

module.exports = parseUserInputSurvey
