const convert = require('../src/stats/process-knowledge-questions')

const input = {
  frontend: {
    react: [1000, 2000, 3000, 4000, 5000],
    'angular-1': [1, 2, 3, 4, 5],
    other: { inferno: 11, preact: 22, xxx: 10 },
    happy: [10, 20, 30, 40, 50]
  },
  backend: {
    meteor: [1, 2, 3, 4, 5],
    express: [1, 2, 3, 4, 5],
    other: { graphql: 33, yyy: 30, rails: 1 },
    happy: [50, 40, 30, 20, 10]
  }
  // features: {}
}

const expectedOutput = {
  frontend: {
    data: {
      react: [1000, 2000, 3000, 4000, 5000],
      'angular-1': [1, 2, 3, 4, 5]
    },
    others_clean: { inferno: 11, preact: 22 },
    happy: [10, 20, 30, 40, 50]
  },
  backend: {
    data: {
      meteor: [1, 2, 3, 4, 5],
      express: [1, 2, 3, 4, 5]
    },
    others_clean: {
      graphql: 33,
      rails: 1
    },
    happy: [50, 40, 30, 20, 10]
  }
  // features: {}
}

test('Group `knowledge` questions under `data`', () => {
  const output = convert(input)
  expect(output).toEqual(expectedOutput)
})
