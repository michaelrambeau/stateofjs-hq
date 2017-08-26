/*
Functions used by country aggregation feature: `node cli aggregate --country`
*/
const mapValues = require('lodash.mapvalues')
const R = require('ramda')

const isKnowledgeQuestion = q => {
  return typeof q === 'number' || q.type === 'knowledge'
}

// Given a key-values object, apply the reducer to all values
const reduceKeyValues = (json, seed, reducer) => {
  return R.pipe(
    R.filter(isKnowledgeQuestion),
    R.mapObjIndexed((values, key) => [values].reduce(reducer, seed[key]))
  )(json)
}

const reduceCategories = (json, seed, reducer) => {
  return mapValues(json, (acc, category) => {
    return reduceKeyValues(acc, seed[category], reducer)
  })
}

// Reducer to aggregate results by country
// to be applied to a nested state whose shape is:
// { category: { key: { country }}}
const responseByCountryReducer = (state, response) => {
  return reduceCategories(
    response.answers,
    state,
    incrementCountryCounter(response.meta.location)
  )
}

const getInitialState = ({ questions, countries, defaultValue }) => {
  const countersByCountry = countries.reduce(
    (acc, val) =>
      Object.assign({}, acc, {
        [val]: defaultValue
      }),
    {}
  )
  const processCategory = R.pipe(
    R.find(isKnowledgeQuestion),
    R.prop('items'),
    R.map(R.prop('key')),
    R.reduce(
      (acc, val) => Object.assign({}, acc, { [val]: countersByCountry }),
      {}
    )
  )
  const hasKnowledgeQuestion = categoryQuestions =>
    R.filter(isKnowledgeQuestion)(categoryQuestions).length > 0
  return R.pipe(R.filter(hasKnowledgeQuestion), R.map(processCategory))(
    questions
  )
}

const reduceResponsesByCountry = ({ questions, countries }) => responses => {
  const seed = getInitialState({
    questions,
    countries,
    defaultValue: [0, 0, 0, 0, 0]
  })
  return responses.reduce(responseByCountryReducer, seed)
}

function incrementCounterArray(state, answer) {
  const value = typeof answer === 'number' ? answer : answer.value
  return state.map((n, index) => (index === value ? n + 1 : n))
}

const incrementCountryCounter = country => (state, value) => {
  const counters = state[country]
  if (!counters) return state
  return Object.assign({}, state, {
    [country]: incrementCounterArray(counters, value)
  })
}

module.exports = {
  reduceKeyValues,
  reduceCategories,
  incrementCounterArray,
  responseByCountryReducer,
  incrementCountryCounter,
  getInitialState,
  reduceResponsesByCountry
}
