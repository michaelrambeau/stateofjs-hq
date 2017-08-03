const debug = require('debug')('agg')
const mapValues = require('lodash.mapvalues')

function metaFieldReducer(state, { name, value }) {
  const count = state[name][value]
  const fieldCounters = Object.assign({}, state[name], {
    [value]: count ? count + 1 : 1
  })
  return Object.assign({}, state, {
    [name]: fieldCounters
  })
}

// function answersReducer(state, { key, value, category, type }) {
//   return Object.assign({}, state[category], {
//     [key]: updatedCounters
//   })
// }

function answersReducer(state, { key, value, category, type }) {
  debug('reduce item', { key, value, category, type })
  const counters = state[key]
  const updatedCounters = updateAnswerCounter(counters, {
    key,
    value,
    category,
    type
  })
  return Object.assign({}, state, {
    [key]: updatedCounters
  })
}

const ensureArray = a => (Array.isArray(a) ? a : [a])

function updateAnswerCounter(state, { key, value, type }) {
  if (Array.isArray(state)) return incrementArrayItem(state, value)
  switch (type) {
    case 'multi':
    case 'single':
      if (value === '') return increment(state, 'EMPTY')
      if (typeof value === 'string')
        return incrementNestedPath(state, 'other', value)
      return Object.assign({}, state, {
        options: incrementArrayItem(state.options, value),
        other: increment(
          state.other,
          ensureArray(value).filter(x => typeof x === 'string')
        )
      })
    default:
      return {}
  }
}

function incrementArrayItem(state, values) {
  const array = ensureArray(values)
  return state.map((n, index) => (array.includes(index) ? n + 1 : n))
}

function incrementNestedPath(state, path, key) {
  debug('incrementNestedPath', state, path, key)
  const subState = increment(state[path], key)
  return Object.assign({}, state, { [path]: subState })
}

function increment(state, path) {
  debug('> inc', state, path)
  if (Array.isArray(path) && path.length === 0) return state
  const stringPath = Array.isArray(path) ? path[0] : path
  const key = stringPath
  return Object.assign({}, state, {
    [key]: state.key ? state.key + 1 : 1
  })
}

function counterReducer(state, data) {
  const meta = Object.keys(data.meta)
    .map(key => ({ name: key, value: data.meta[key] }))
    .reduce(metaFieldReducer, state.meta)
  // const answers = mapValues(data.answers, (categoryAnswers, category) => {
  //   return categoryAnswers.reduce(answersReducer, state.answers[category])
  // })
  const answers = mapValues(state.answers, (categoryAnswers, category) => {
    // debug('answers', categoryAnswers)
    if (!data.answers || !data.answers[category]) return categoryAnswers
    return data.answers[category].reduce(
      answersReducer,
      state.answers[category]
    )
  })
  return {
    meta,
    answers
  }
}

module.exports = counterReducer
