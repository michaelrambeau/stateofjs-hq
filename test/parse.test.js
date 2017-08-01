const parseCSV = require('../src/parse-csv')

test('It should parse correctly CSV content', () => {
  const input = '1,2,"[0,1]"'
  return parseCSV(input).then(rows => {
    const expected = [[1, 2, [0, 1]]]
    expect(rows).toEqual(expected)
  })
})
