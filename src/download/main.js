require('dotenv').config()
const axios = require('axios')
const debug = require('debug')('download')
const encode = require('../encode-api-response')
const createSurvey = require('../survey')
const path = require('path')
const csv = require('csv')
const { promisify } = require('util')
const stringify = promisify(csv.stringify)
const fs = require('fs-extra')

const { TYPEFORM_API_KEY, TYPEFORM_UID } = process.env

async function downloadTypeformData(options) {
  const { limit = 10, offset = 0, uid, key } = options
  const url = `https://api.typeform.com/v1/form/${uid}?key=${key}&completed=true&limit=${limit}&offset=${offset}`
  debug('Download', options)
  const response = await axios.get(url)
  return response.data
}

async function writeCsvFile(data, filename) {
  const filepath = path.join(process.cwd(), 'output', filename)
  const csvContent = await stringify(data)
  return fs.outputFile(filepath, csvContent)
}

async function main() {
  const options = {
    uid: TYPEFORM_UID,
    key: TYPEFORM_API_KEY,
    offset: 1,
    limit: 1
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
    await writeCsvFile(encodedResponses, 'data.csv')
    console.log('THE END')
  } catch (err) {
    console.error(err)
  }
}

main()
