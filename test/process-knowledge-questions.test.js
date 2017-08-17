const convert = require('../src/stats/process-knowledge-questions')

const input = {
  frontend: {
    react: [1, 2, 3, 4, 5],
    'angular-1': [1, 2, 3, 4, 5],
    other: { interno: 1, preact: 2 },
    happy: {}
  },
  backend: {
    meteor: [1, 2, 3, 4, 5],
    express: [1, 2, 3, 4, 5],
    other: {
      loopback: 1
    },
    happy: {}
  }
}

const expectedOutput = {
  frontend: {
    data: {
      react: [1, 2, 3, 4, 5],
      'angular-1': [1, 2, 3, 4, 5]
    },
    other: { interno: 1, preact: 2 },
    happy: {}
  },
  backend: {
    data: {
      meteor: [1, 2, 3, 4, 5],
      express: [1, 2, 3, 4, 5]
    },
    other: {
      loopback: 1
    },
    happy: {}
  }
}

test('Group `knowledge` questions under `data`', () => {
  const output = convert(input)
  expect(output).toEqual(expectedOutput)
})
