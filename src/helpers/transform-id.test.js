const transformId = require('./transform-id')

test('It should return a shorter id', () => {
  const id = transformId('list_55680622_choice_69899415')
  expect(id).toBe('list_55680622')
})

test('It should return a shorter id', () => {
  const id = transformId('list_55680622_other')
  expect(id).toBe('list_55680622')
})

test('It should not change the id', () => {
  const id = 'rating_nZC0'
  expect(transformId(id)).toBe(id)
})
