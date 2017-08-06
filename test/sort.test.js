const { sortByValue } = require('../src/sort-helpers')

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
