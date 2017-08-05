const csv = require('csv')
const { promisify } = require('util')
const parse = promisify(csv.parse)

function parseValue(source) {
  if (/^\[.+\]$/.test(source)) {
    return eval(source)
  }
  return source
}

const parseRow = row => row.map(parseValue)

async function parseCSV(source) {
  const rows = await parse(source, { auto_parse: true })
  return rows.map(parseRow)
}

module.exports = parseCSV
