const mapValues = require('lodash.mapvalues')

function processAggResponses(categoryReponses) {
  const rates = mapValues(categoryReponses.data, processQuestion)
  return rates
}

function format(rate) {
  return Math.round(rate * 100)
}

function processQuestion(values) {
  const total = values.reduce((acc, val) => acc + val, 0)
  const rates = values.map(val => val / total).map(format)
  const satisfied = format(values[3] / (values[3] + values[4]))
  return { rates, satisfied }
}

module.exports = processAggResponses
