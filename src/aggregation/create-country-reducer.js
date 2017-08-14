const getInitialState = require('./initial-state')

function getDefaultCountryState() {
  return getInitialState()
}

const createCountryReducer = reducer => (state, data) => {
  const location = data.meta.location
  const previousCountryState = state[location] || getDefaultCountryState()
  const nextCountryState = [data].reduce(reducer, previousCountryState)
  return Object.assign({}, state, { [location]: nextCountryState })
}

module.exports = createCountryReducer
