const {
  // responseReducer,
  reduceCategories,
  reduceKeyValues,
  incrementCounterArray,
  responseByCountryReducer,
  getInitialState,
  reduceResponsesByCountry
} = require('../src/aggregation/by-country')

const questions = require('../src/survey/questions')

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
  const seed = {
    frontend: { a: [1, 0, 0, 0, 0], b: [0, 0, 0, 0, 0] },
    backend: { a: [0, 0, 0, 0, 1], b: [0, 0, 0, 0, 0] }
  }
  const input = { frontend: { a: 1, b: 2 }, backend: { a: 0, b: 1 } }
  const output = reduceCategories(input, seed, incrementCounterArray)
  const expected = {
    backend: { a: [1, 0, 0, 0, 1], b: [0, 1, 0, 0, 0] },
    frontend: { a: [1, 1, 0, 0, 0], b: [0, 0, 1, 0, 0] }
  }
  expect(output).toEqual(expected)
})

const addAnswer = ({ country, category, answers }) => ({
  answers: {
    [category]: answers
  },
  meta: { location: country }
})

test('It should count responses by country', () => {
  const initialState = {
    frontend: {
      react: {
        France: [0, 0, 0, 0, 0],
        Japan: [0, 0, 0, 0, 0]
      },
      vue: {
        France: [0, 0, 0, 0, 0],
        Japan: [0, 0, 0, 0, 0]
      }
    }
  }
  const input = [
    { country: 'France', category: 'frontend', answers: { react: 2 } }
    // { country: 'France', category: 'frontend', key: 'vue', value: 4 }
  ].map(addAnswer)

  const expectedState = {
    frontend: {
      react: {
        France: [0, 0, 1, 0, 0],
        Japan: [0, 0, 0, 0, 0]
      }
    }
  }
  // const state = data.reduce(responseReducer, initialState)
  const output = input.reduce(responseByCountryReducer, initialState)
  expect(output).toEqual(expectedState)
})

test('Create the intial state from the survey questions', () => {
  const initialState = getInitialState({
    countries: ['France', 'Japan'],
    defaultValue: [0, 0, 0, 0, 0],
    questions
  })
  expect(initialState.frontend.react.France).toEqual([0, 0, 0, 0, 0])
  expect(initialState.backend.express.Japan).toEqual([0, 0, 0, 0, 0])
})

test('It should group responses by country', () => {
  const responses = [
    { country: 'France', category: 'frontend', answers: { react: 2, vue: 4 } }
    // { country: 'France', category: 'frontend', key: 'vue', value: 4 }
  ].map(addAnswer)
  const countries = ['France', 'Japan']
  const state = reduceResponsesByCountry({ questions, countries })(responses)
  expect(state.frontend.react.France).toEqual([0, 0, 1, 0, 0])
  expect(state.frontend.vue.France).toEqual([0, 0, 0, 0, 1])
})
