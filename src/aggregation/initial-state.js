const debug = require('debug')('agg')
const R = require('ramda')
const times = require('lodash.times')

const createSurvey = require('../survey')
const questionTypes = require('../survey/options')

function questionToDefaultAgg(question) {
  const counters = options => times(options.length).map(() => 0)
  if (questionTypes[question.type])
    return counters(questionTypes[question.type])
  switch (question.type) {
    case 'multi':
    case 'single':
      return { options: counters(question.options), other: {} }
    default:
      return {}
  }
}

function getInitialState(options = {}) {
  const categories = [
    'frontend',
    'flavors',
    'datalayer',
    'backend',
    'testing',
    'css',
    'build',
    'mobile',
    'otherTools',
    'features',
    'opinion',
    'aboutYou'
  ]
  const survey = createSurvey(categories)
  const meta = survey.meta
    .filter(item => !['date'].includes(item.name))
    .reduce((acc, item) => Object.assign({}, acc, { [item.name]: {} }), {})
  const groupByCategory = R.groupBy(R.prop('category'))
  const groupByKey = R.reduce(
    (acc, item) =>
      ['email', 'comments'].includes(item.key)
        ? acc
        : Object.assign({}, acc, { [item.key]: questionToDefaultAgg(item) }),
    {}
  )
  const answers = R.compose(R.mapObjIndexed(groupByKey), groupByCategory)(
    survey.questions.filter(options.filterQuestion || (x => x))
  )
  return { meta, answers }
}

module.exports = getInitialState
