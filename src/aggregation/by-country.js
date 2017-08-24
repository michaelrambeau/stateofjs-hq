const mapValues = require('lodash.mapvalues')

const reduceKeyValues = (json, seed, reducer) =>
  // /const initialState = mapValues(json, values => seed)
  {
    return mapValues(json, (values, key) => [values].reduce(reducer, seed[key]))
  }

const reduceCategories = (json, seed, reducer) => {
  return mapValues(json, (acc, category) =>
    reduceKeyValues(acc, seed[category], reducer)
  )
}

const reduceCategoriesWithCountries = (json, seed) => {
  return reduceCategories(
    json.answers,
    seed,
    incrementCountryCounter(json.meta.location)
  )
}

function incrementCounterArray(state, value) {
  return state.map((n, index) => (index === value ? n + 1 : n))
}

const incrementCountryCounter = country => (state, value) => {
  const counters = state[country]
  console.log('> inc', state, value, country, counters)
  return Object.assign({}, state, {
    [country]: incrementCounterArray(counters, value)
  })
}

module.exports = {
  // responseReducer,
  reduceKeyValues,
  reduceCategories,
  incrementCounterArray,
  reduceCategoriesWithCountries,
  incrementCountryCounter
}
