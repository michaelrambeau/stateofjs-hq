const numeral = require('numeral')
const format = number => `${numeral(number).format('00000')}`

const numberToFilename = page => {
  const number = 1 + (page - 1) * 1000
  return `${format(number)}.csv`
}

module.exports = numberToFilename
