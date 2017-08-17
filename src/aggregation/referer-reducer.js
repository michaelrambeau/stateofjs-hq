const debug = require('debug')('reducer')
const url = require('url')

const cleanReferer = ref => (ref ? ref.toString().trim().toLowerCase() : '')

const parseReferer = value => {
  const cleaned = cleanReferer(value)
  if (!cleaned) return ''
  const parts = url.parse(cleaned)
  return parts.hostname ? `${parts.hostname}${parts.pathname}` : cleaned
}

const refererReducer = () => (state, response) => {
  const referer = parseReferer(response.meta.referer)
  const data = referer
    ? Object.assign({}, state.data, {
        [referer]: state.data[referer] ? state.data[referer] + 1 : 1
      })
    : state.data
  const count = state.data[referer] ? state.count : state.count + 1
  return { count, data }
}

module.exports = refererReducer
