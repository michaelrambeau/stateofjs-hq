const debug = require('debug')('agg')
const times = require('lodash.times')
const groupBy = require('lodash.groupby')
const mapValues = require('lodash.mapvalues')
const R = require('ramda')

const createSurvey = require('./survey')
const questionTypes = require('./survey/options')

function questionToDefaultAgg(question) {
  // debug('>>> Q=', question)
  const counters = options => times(options.length).map(() => 0)
  if (questionTypes[question.type])
    return counters(questionTypes[question.type])
  switch (question.type) {
    case 'multi':
    case 'single':
      return { options: counters(question.options) }
    default:
      return {}
  }
}

function createDefaultAggregation() {
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
  const meta = survey.meta.reduce(
    (acc, item) => Object.assign({}, acc, { [item.name]: {} }),
    {}
  )
  const groupByCategory = R.groupBy(R.prop('category'))
  const groupByKey = R.reduce(
    (acc, item) =>
      Object.assign({}, acc, { [item.key]: questionToDefaultAgg(item) }),
    {}
  )
  const questions = R.compose(R.mapObjIndexed(groupByKey), groupByCategory)(
    survey.questions
  )
  debug('React', questions.frontend.react)
  return { meta, questions }
}

function aggregate() {
  const defaultAgg = createDefaultAggregation()
  // debug(defaultAgg)
  return defaultAgg
}

module.exports = aggregate
