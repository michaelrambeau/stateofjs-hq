const path = require('path')
const questions = require('../../src/survey/questions')
const backend = require('./input/backend.json')

const {
  compactWithShortList,
  compactCategoryAnswers,
  compactJsonFile,
  compactAllJsonFiles
} = require('../../src/stats/compact-other')

const keywords = [
  { text: 'node.js', query: '^node$|node\\.?js|node js', shortlist: true },
  { text: 'rails', query: 'rails|ruby on rails', shortlist: true },
  { text: 'dotnet', query: 'asp\\. ?net|c#|\\.net|dotnet', shortlist: true },
  { text: 'php', shortlist: true },
  { text: 'restify', shortlist: true },
  'scala',
  'trails',
  'kraken',
  'couchdb'
]

const expectedOther = {
  'node.js': 5,
  dotnet: 5,
  restify: 4,
  php: 3
}

test('It should remove responses that do not belong to the short list', () => {
  const output = compactWithShortList(backend.other, keywords)
  expect(output).toEqual(expectedOther)
})

test('It should compact `other` responses, removing values that do not belong to the short list', () => {
  const output = compactCategoryAnswers({
    answers: backend,
    questionKey: 'other',
    keywords
  })
  const expectedOutput = {
    meteor: [118, 168, 540, 64, 110],
    express: [43, 117, 81, 695, 64],
    other: expectedOther,
    happy: [40, 67, 326, 371, 166]
  }
  expect(output).toEqual(expectedOutput)
})

test('It should compact the content of a single JSON file', () => {
  const filepath = path.join(
    process.cwd(),
    'test',
    'compact',
    'input',
    'backend.json'
  )
  return compactJsonFile({
    questions,
    category: 'backend',
    filepath,
    questionKey: 'other',
    keywords
  }).then(result => {
    expect(Object.keys(result).sort()).toEqual(['data', 'happy', 'other'])
    expect(Object.keys(result.data)).toEqual(['meteor', 'express'])
    expect(Object.keys(result.other)).toEqual([
      'node.js',
      'dotnet',
      'restify',
      'php'
    ])
  })
})

test('It should compact all files in the folder', () => {
  const inputFolderPath = path.join(process.cwd(), 'test', 'compact', 'input')
  return compactAllJsonFiles({
    inputFolderPath,
    questionKey: 'other',
    questions
  }).then(result => {
    expect(Object.keys(result).sort()).toEqual(['backend', 'frontend'])
  })
})
