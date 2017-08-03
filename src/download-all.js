// const debug = require('debug')('download')
// const times = require('lodash.times')
const pWhilst = require('p-whilst')

function downloadAll({ download, limit = 1000 }) {
  let total = 0
  let start = 1
  let hasMore = true
  return pWhilst(
    () => hasMore,
    () => {
      return download({ start, limit }).then(result => {
        total = result.completed
        start = start + limit
        hasMore = start < total
      })
    }
  ).then(() => ({
    total
  }))
}

module.exports = downloadAll
