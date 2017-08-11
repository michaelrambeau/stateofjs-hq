const { sortByValue, sortAnswers, sortMeta } = require('../src/sort-helpers')

test('Sort a hashmap by count', () => {
  const input = {
    AngularJS: 100,
    Backbone: 10,
    React: 200
  }
  const output = sortByValue(input)
  expect(Object.keys(output)).toEqual(['React', 'AngularJS', 'Backbone'])
  expect(output).toEqual({ React: 200, AngularJS: 100, Backbone: 10 })
})

test('Sort `meta` values', () => {
  const meta = {
    country: {
      France: 1,
      Japan: 2
    },
    city: {
      Osaka: 2,
      Toulouse: 10,
      Paris: 5
    }
  }

  const expected = {
    country: {
      Japan: 2,
      France: 1
    },
    city: {
      Toulouse: 10,
      Osaka: 2,
      Paris: 5
    }
  }
  const sorted = sortMeta(meta)
  expect(sorted).toEqual(expected)
})

test('Sort `other` question', () => {
  const answers = {
    frontend: {
      react: { x: 'y' },
      other: {
        AngularJS: 100,
        Backbone: 10,
        React: 200
      }
    },
    backend: {
      keystone: { y: 'z' },
      other: {
        '24': 1,
        Feathers: 100,
        Loopback: 10,
        Express: 200
      }
    }
  }
  const expected = {
    frontend: {
      react: { x: 'y' },
      other: { React: 200, AngularJS: 100, Backbone: 10 }
    },
    backend: {
      keystone: { y: 'z' },
      other: { Express: 200, Feathers: 100, Loopback: 10 }
    }
  }
  const sorted = sortAnswers(answers)
  expect(Object.keys(sorted.frontend.other)).toEqual([
    'React',
    'AngularJS',
    'Backbone'
  ])
  expect(Object.keys(sorted.backend.other)).toEqual([
    'Express',
    'Feathers',
    'Loopback'
  ])
  expect(sorted).toEqual(expected)
})
