require('dotenv').config()
const axios = require('axios')
const { promisify } = require('util')
const path = require('path')
const csv = require('csv')
const debug = require('debug')('download')
const fs = require('fs-extra')
const numeral = require('numeral')
const prettyBytes = require('pretty-bytes')

const encode = require('../../src/encode-api-response')
const createSurvey = require('../../src/survey')
const stringify = promisify(csv.stringify)

const { TYPEFORM_API_KEY, TYPEFORM_UID } = process.env

async function downloadTypeformData(options) {
  const { limit = 1000, offset = 0, uid, key } = options
  const url = `https://api.typeform.com/v1/form/${uid}?key=${key}&completed=true&limit=${limit}&offset=${offset}`
  debug('Download', options)
  const response = await axios.get(url)
  return response.data
}

async function writeCsvFile({ data, filename, logger }) {
  const filepath = path.join(process.cwd(), 'output', filename)
  const csvContent = await stringify(data)
  logger.info(
    'CSV file created',
    filename,
    prettyBytes(csvContent.length),
    `${data.length} rows`
  )
  return fs.outputFile(filepath, csvContent)
}

async function main({ limit, start = 1 }, logger) {
  const options = {
    uid: TYPEFORM_UID,
    key: TYPEFORM_API_KEY,
    offset: start - 1,
    limit
  }
  try {
    const json = await downloadTypeformData(options)
    const { questions, responses } = json
    const survey = createSurvey([
      'frontend',
      'flavors',
      'datalayer',
      'backend',
      'testing',
      'css',
      'build',
      'mobile',
      'otherTools',
      'features',
      'opinion'
    ])
    const encodedResponses = responses.map(response =>
      encode(survey, questions)(response)
    )
    await writeCsvFile({
      data: encodedResponses,
      filename: `${numeral(start).format('00000')}.csv`,
      logger
    })
    logger.info('THE END')
  } catch (err) {
    console.error(err)
  }
}

module.exports = main
