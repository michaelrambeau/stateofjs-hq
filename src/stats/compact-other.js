/*
Functions used by the `stats` step of the pipeline
*/
const debug = require('debug')('compact')
const fs = require('fs-extra')
const path = require('path')
const flatten = require('lodash.flatten')

const isShortListMember = keywords => (count, key) => {
  const found = keywords.find(item => item.text === key)
  return found && found.shortlist
}

// Filter a list of responses to keep only the keywords that belong to the "short list"
function compactWithShortList(input, keywords) {
  return Object.keys(input)
    .filter(key => isShortListMember(keywords)(input[key], key))
    .reduce(
      (acc, val) =>
        Object.assign({}, acc, {
          [val]: input[val]
        }),
      {}
    )
}

// Filter responses to a given question (E.g. questionKey = `other` to filter other responses)
function compactCategoryAnswers({ answers, questionKey, keywords }) {
  if (!answers[questionKey]) return answers
  const compacted = compactWithShortList(answers[questionKey], keywords)
  return Object.assign({}, answers, {
    [questionKey]: compacted
  })
}

// Group all answers to the `knowledge` questions of a given category under a `data` property
const processCategoryAnswers = ({ questions, categoryAnswers, category }) => {
  const { other, happy } = categoryAnswers
  const dataKeys = flatten(
    questions[category]
      .filter(question => question.type === 'knowledge')
      .map(question => question.items)
  )
    .filter(item => !!categoryAnswers[item.key])
    .map(item => item.key)
  const reducer = (acc, val) =>
    Object.assign({}, acc, { [val]: categoryAnswers[val] })
  const data = dataKeys.reduce(reducer, {})
  return {
    data,
    other,
    happy
  }
}

// Process a single file of answers to a given category (E.g. `frontend.json`)
async function compactJsonFile({
  questions,
  category,
  filepath,
  questionKey,
  keywords
}) {
  debug('> JSON', filepath)
  const answers = await fs.readJson(filepath)
  // STEP 1: compact responses to the other question using the shortlist of keywords
  const compacted = compactCategoryAnswers({ answers, questionKey, keywords })
  // STEP 2: group answers under `data` property
  const grouped = processCategoryAnswers({
    questions,
    category,
    categoryAnswers: compacted
  })
  return grouped
}

// Process all files in a given folder
async function compactAllJsonFiles({
  inputFolderPath,
  questionKey,
  questions
}) {
  // Get the category name from the JSON file name
  const getCategory = filename => filename.split('.')[0]
  // Get all keywords related to a given question
  const getKeywords = category => {
    const question = questions[category].find(item => item.key === questionKey)
    return question && question.keywords
  }
  // Read the folder content and create an object of "input items": [{ category, filepath}]
  const filenames = await fs.readdir(inputFolderPath)
  const input = filenames.map(filename => ({
    category: getCategory(filename),
    filepath: path.join(inputFolderPath, filename)
  }))
  // Transformation applied to every file content
  const processJsonFile = async inputItem => {
    const keywords = getKeywords(inputItem.category)
    return compactJsonFile({
      questions,
      category: inputItem.category,
      filepath: inputItem.filepath,
      questionKey,
      keywords
    })
  }
  const results = await Promise.all(input.map(processJsonFile))
  // Create an object sorted by category from the array of results
  return input.reduce(
    (acc, val, i) =>
      Object.assign({}, acc, {
        [val.category]: results[i]
      }),
    {}
  )
}

module.exports = {
  compactWithShortList,
  compactCategoryAnswers,
  compactJsonFile,
  compactAllJsonFiles
}
