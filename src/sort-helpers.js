const debug = require('debug')('sort')
const mapValues = require('lodash.mapvalues')

const sortKeys = fn => hashMap => {
  const sortedItems = Object.keys(hashMap)
    .map(key => ({ key, item: hashMap[key] }))
    .sort((a, b) => (fn(a) > fn(b) ? -1 : 1))
  return sortedItems.reduce(
    (acc, item) => Object.assign({}, acc, { [item.key]: item.item }),
    {}
  )
}

const sortByValue = sortKeys(value => value.item)

function sortMeta(metaSource) {
  return mapValues(metaSource, sortByValue)
}

function sortAnswers(answersSource) {
  const categories = ['frontend']
  const hasOtherQuestion = category => categories.includes(category)
  const sortedCategories = Object.keys(answersSource)
    .filter(hasOtherQuestion)
    .map(category => ({ [category]: sortOther(category, answersSource) }))
    .reduce(
      (acc, val) =>
        Object.assign({}, acc, {
          [Object.keys(val)[0]]: Object.values(val)[0][0]
        }),
      {}
    )
  debug('Sorted', sortedCategories)
  const answers = Object.assign({}, answersSource, sortedCategories)
  return answers
}

function sortOther(category, answersSource) {
  const categories = [category]
  return categories.map(key => answersSource[key]).map(sortCategoryQuestions)
}

function sortCategoryQuestions(questions) {
  const other = sortByValue(questions['other'])
  return Object.assign({}, questions, { other })
}

module.exports = {
  sortAnswers,
  sortByValue,
  sortMeta
}
