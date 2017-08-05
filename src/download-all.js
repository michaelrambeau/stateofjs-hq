// const debug = require('debug')('download')
// const times = require('lodash.times')
const pWhilst = require('p-whilst')

function downloadAll({ download, limit = 1000, start = 1 }) {
  let total = 0
  let nextRequestStart = start
  let hasMore = true
  return pWhilst(
    () => hasMore,
    () => {
      return download({ start: nextRequestStart, limit }).then(result => {
        total = total === 0 ? result.completed : total
        nextRequestStart = nextRequestStart + limit
        hasMore = nextRequestStart < total
      })
    }
  ).then(() => ({
    total
  }))
}

module.exports = downloadAll
