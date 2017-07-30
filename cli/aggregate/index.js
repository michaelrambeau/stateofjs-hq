const fs = require('fs-extra')
const csv = require('csv')
const { promisify } = require('util')
const parse = promisify(csv.parse)
const path = require('path')
const debug = require('debug')('parse')

async function readCsv(filename) {
  const filepath = path.join(process.cwd(), 'output', filename)
  debug('Reading CSV file', filepath)
  const data = await fs.readFile(filepath)
  const json = await parse(data)
  debug(Array.isArray(json), json.length)
  return json
}

function readColumn(rows, columnIndex) {
  return rows.map(row => row[columnIndex]).reduce((acc, value) => {
    return Object.assign({}, acc, {
      [value]: acc[value] ? acc[value] + 1 : 1
    })
  }, {})
}

async function main() {
  const rows = await readCsv('00001.csv')
  const aggregated = readColumn(rows, 6)
  debug(aggregated)
  debug(readColumn(rows, 3))
  debug(readColumn(rows, 4))
  debug(readColumn(rows, 7))
  debug(readColumn(rows, 1))
}

module.exports = main
