const flatten = require('lodash.flatten')
const allQuestions = require('./questions')
const options = require('./options')

const meta = [
  { name: 'date', path: 'metadata.date_submit' },
  { name: 'referer', path: 'hidden.referrer' },
  { name: 'location', path: 'hidden.location' },
  { name: 'city', path: 'hidden.city' },
  { name: 'device', path: 'hidden.device' },
  { name: 'os', path: 'hidden.os' },
  { name: 'browser', path: 'hidden.browser' }
]

// Create the `survey` object `{questions, meta, types}` that defines the survey questions
// from an array of categories [`frontend`, `backend`, ...]
function createSurvey(categories) {
  const questions = categories.reduce((acc, category) => {
    const categoryQuestions = allQuestions[category]
    if (!categoryQuestions)
      throw new Error(`No questions found for the category "${category}"`)
    return acc.concat(
      categoryQuestions.map(q => Object.assign({}, q, { category }))
    )
  }, [])
  const questionFlatList = flatten(
    questions.map(
      question =>
        Array.isArray(question.items)
          ? question.items.map(item => ({
              text: item.text,
              key: item.key,
              category: question.category,
              type: question.type
            }))
          : [question]
    )
  )
  const survey = {
    questions: questionFlatList,
    types: options,
    meta
  }
  return survey
}

module.exports = createSurvey
