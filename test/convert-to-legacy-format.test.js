function convertToLegacyFormat(data) {
  const options = [
    "I've never heard of it",
    "I've HEARD of it, and WOULD like to learn it",
    "I've HEARD of it, and am NOT interested",
    "I've USED it before, and WOULD use it again",
    "I've USED it before, and would NOT use it again"
  ]
  const reducer = (state, value, i) =>
    Object.assign({}, state, {
      [options[i]]: value
    })
  return Object.keys(data).map(key =>
    data[key].reduce(reducer, { Option: key })
  )
}

test('It should convert data to 2016 format', () => {
  const input = {
    react: [3, 163, 92, 698, 44],
    'angular-1': [1, 35, 338, 149, 477]
  }
  const output = convertToLegacyFormat(input)
  expect(output).toEqual([
    {
      Option: 'react',
      "I've never heard of it": 3,
      "I've HEARD of it, and WOULD like to learn it": 163,
      "I've HEARD of it, and am NOT interested": 92,
      "I've USED it before, and WOULD use it again": 698,
      "I've USED it before, and would NOT use it again": 44
    },
    {
      Option: 'angular-1',
      "I've never heard of it": 1,
      "I've HEARD of it, and WOULD like to learn it": 35,
      "I've HEARD of it, and am NOT interested": 338,
      "I've USED it before, and WOULD use it again": 149,
      "I've USED it before, and would NOT use it again": 477
    }
  ])
})
