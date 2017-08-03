const debug = require('debug')('download')
const times = require('lodash.times')
const downloadAll = require('../src/download-all')

const createDownload = completed => ({ start, limit }) => {
  debug('Download from', start, 'to', limit + start - 1)
  return Promise.resolve({
    completed,
    responses: times(limit).map(i => i + start)
  })
}

test('Download single function page 1', () => {
  const download = createDownload(10)
  return download({ start: 1, limit: 5 }).then(result => {
    expect(result.responses).toEqual([1, 2, 3, 4, 5])
  })
})

test('Download single function page 2', () => {
  const download = createDownload(10)
  return download({ start: 101, limit: 5 }).then(result => {
    expect(result.responses).toEqual([101, 102, 103, 104, 105])
  })
})

test('Download and pagination', () => {
  const download = createDownload(12123)
  downloadAll({ download }).then(result => {
    const { total } = result
    expect(total).toBe(12123)
    debug('The end')
  })
})
