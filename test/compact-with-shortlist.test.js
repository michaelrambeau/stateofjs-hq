const {
  compactWithShortList,
  compactCategoryAnswers
} = require('../src/stats/compact-other')

const other = {
  EMPTY: 913,
  'node.js': 5,
  dotnet: 5,
  restify: 4,
  elixir: 4,
  'socket.io': 4,
  adonis: 4,
  php: 3,
  django: 3,
  micro: 3,
  java: 3,
  graphql: 2,
  python: 2,
  serverless: 2,
  impress: 2,
  firebase: 2
}

const answers = {
  meteor: [118, 168, 540, 64, 110],
  express: [43, 117, 81, 695, 64],
  other
}

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
  const output = compactWithShortList(other, keywords)
  expect(output).toEqual(expectedOther)
})

test('It should compact `other` responses, removing values that do not belong to the short list', () => {
  const output = compactCategoryAnswers({ answers, path: 'other', keywords })
  const expectedOutput = {
    meteor: [118, 168, 540, 64, 110],
    express: [43, 117, 81, 695, 64],
    other: expectedOther
  }
  expect(output).toEqual(expectedOutput)
})
