const debug = require('debug')('agg')
const mapValues = require('lodash.mapvalues')

const emptyValues = ['undefined', '']
const isEmptyValue = value => emptyValues.includes(value.toLowerCase())

function metaFieldReducer(state, { name, value }) {
  const key = isEmptyValue(value) ? 'EMPTY' : value
  const count = state[name][key]
  const fieldCounters = Object.assign({}, state[name], {
    [key]: count ? count + 1 : 1
  })
  return Object.assign({}, state, {
    [name]: fieldCounters
  })
}

function answersReducer(state, { key, value, category, type, words }) {
  debug('reduce item', { key, value, category, type })
  const counters = state[key]
  const updatedCounters = updateAnswerCounter(counters, {
    key,
    value,
    category,
    type,
    words
  })
  return Object.assign({}, state, {
    [key]: updatedCounters
  })
}

const ensureArray = a => (Array.isArray(a) ? a : [a])

function normalizeValue(value = '', key) {
  return value.toString().toLowerCase()
}

function updateAnswerCounter(state, { key, value, type, words }) {
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
      return Array.isArray(value)
        ? incrementKeywords(state, value)
        : increment(state, normalizeValue(value, key, words))
  }
}

function incrementArrayItem(state, values) {
  const array = ensureArray(values)
  return state.map((n, index) => (array.includes(index) ? n + 1 : n))
}

function incrementKeywords(state, values) {
  debug('Increment array of values', values)
  return values.reduce((acc, val) => increment(acc, val), state)
}

function incrementNestedPath(state, path, key) {
  const subState = increment(state[path], key)
  return Object.assign({}, state, { [path]: subState })
}

function increment(state = {}, path) {
  debug('> inc', state, path)
  if (Array.isArray(path) && path.length === 0) return state
  const stringPath = Array.isArray(path) ? path[0] : path
  const key = stringPath || 'EMPTY'
  return Object.assign({}, state, {
    [key]: state[path] ? state[path] + 1 : 1
  })
}

const createReducer = survey => (state, data) => {
  const meta = Object.keys(data.meta)
    .filter(key => !['date'].includes(key))
    .map(key => ({ name: key, value: data.meta[key] }))
    .reduce(metaFieldReducer, state.meta)
  const answers = mapValues(state.answers, (categoryAnswers, category) => {
    if (!data.answers || !data.answers[category]) return categoryAnswers
    return Object.keys(data.answers[category])
      .filter(key => !['email', 'comments'].includes(key))
      .map(key => {
        const question = survey.questions.find(
          item => item.key === key && item.category === category
        )
        return Object.assign({}, data.answers[category][key], {
          key,
          words: question ? question.words : []
        })
      })
      .reduce(answersReducer, state.answers[category])
  })
  return {
    meta,
    answers
  }
}

module.exports = createReducer