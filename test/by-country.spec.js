const {
  // responseReducer,
  reduceCategories,
  reduceKeyValues,
  incrementCounterArray,
  incrementCountryCounter,
  reduceCategoriesWithCountries
} = require('../src/aggregation/by-country')

test('Checking `reduceKeyValues` low level function', () => {
  const seed = { a: [1, 0, 0, 0, 0], b: [0, 0, 0, 0, 0] }
  const input = { a: 1, b: 2 }
  // const reducer = incrementCounterArray
  const output = reduceKeyValues(input, seed, incrementCounterArray)
  const expected = { a: [1, 1, 0, 0, 0], b: [0, 0, 1, 0, 0] }
  // const state =
  expect(output).toEqual(expected)
})

test('Checking nested keys', () => {
  const seed = { frontend: { a: [1, 0, 0, 0, 0], b: [0, 0, 0, 0, 0] } }
  const input = { frontend: { a: 1, b: 2 } }
  const output = reduceCategories(input, seed, incrementCounterArray)
  const expected = { frontend: { a: [1, 1, 0, 0, 0], b: [0, 0, 1, 0, 0] } }
  expect(output).toEqual(expected)
})

test('Checking country counter', () => {
  const seed = { France: [1, 0, 0, 0, 0], Japan: [1, 0, 0, 0, 0] }
  const input = 4
  const output = incrementCountryCounter('Japan')(seed, input)
  const expected = { France: [1, 0, 0, 0, 0], Japan: [1, 0, 0, 0, 1] }
  expect(output).toEqual(expected)
})

const addAnswer = ({ country, category, key, value }) => ({
  answers: {
    [category]: {
      [key]: value
    }
  },
  meta: { location: country }
})

// test('It should count responses by country', () => {
//   const initialState = {
//     frontend: {
//       react: {
//         France: [0, 0, 0, 0, 0],
//         Japan: [0, 0, 0, 0, 0]
//       }
//     }
//   }
//   const input = addAnswer({
//     country: 'France',
//     category: 'frontend',
//     key: 'react',
//     value: 1
//   })
//
//   const expectedState = {
//     frontend: {
//       react: {
//         France: [0, 1, 0, 0, 0],
//         Japan: [0, 0, 0, 0, 0]
//       }
//     }
//   }
//   // const state = data.reduce(responseReducer, initialState)
//   const output = reduceCategoriesWithCountries(input, initialState)
//   expect(output).toEqual(expectedState)
// })
